const { sendCommand, uploadData } = require("../../libs/smoothie");
const { CubicBezier, QuadricBezier } = require("lw.svg-curves");
const opentype = require("opentype.js");
const store = require("../../store");
const path = require("path");

const publicPath = path.join(__dirname, "../../../public");
const fontPath = path.join(publicPath, "fonts");
const outputFileName = "highlighted.gcode";
const fontName = "deftone_stylus.ttf";
const lineHeight = 50;
const fontSize = 42;

const queue = [];
let isPlaying = false;

module.exports = async function writeMessage({ message }) {
  if (isPlaying) {
    queue.push(message);
    return;
  }

  isPlaying = true;

  let lineNumber = parseInt(store.get("lineNumber", 0));
  const fontFile = path.join(fontPath, fontName);

  opentype.load(fontFile, function (err, font) {
    if (err) {
      console.error("Font could not be loaded: " + err);
    } else {
      const offset = lineHeight - fontSize;
      const yOffset = (fontSize + offset) * lineNumber;
      const path = font.getPath(message, 0, yOffset, fontSize);
      const gcode = ["M4", "G28 X Y", "G90", "G0 F10000"];

      let [x, y] = [0, 0];
      let firstMove = null;
      let isPendown = false;

      lineNumber++;

      const tf = (n) => parseFloat(n.toFixed(2));

      const pendown = () => {
        if (!isPendown) {
          gcode.push(`M4 S5 G4 P50`);
          isPendown = true;
        }
      };

      const penup = () => {
        if (isPendown) {
          gcode.push(`M4 G4 P50`);
          isPendown = false;
        }
      };

      path.commands.forEach((item) => {
        if (item.type === "M") {
          x = tf(item.x);
          y = tf(item.y);
          penup();
          gcode.push(`G1 X${x} Y${y}`);
        } else if (item.type === "L") {
          x = tf(item.x);
          y = tf(item.y);
          if (!firstMove) firstMove = { x, y };
          pendown();
          gcode.push(`G1 X${x} Y${y}`);
        } else if (item.type === "C") {
          const p1 = { x, y };
          if (!firstMove) firstMove = { x, y };
          const p2 = { x: tf(item.x1), y: tf(item.y1) };
          const p3 = { x: tf(item.x2), y: tf(item.y2) };
          const p4 = { x: tf(item.x), y: tf(item.y) };
          let tracer = new CubicBezier({ p1, p2, p3, p4 });
          let coords1 = tracer.trace({ step: 0.1 });
          for (let i = 0; i < coords1.length; i += 2) {
            x = coords1[i];
            y = coords1[i + 1];
            pendown();
            gcode.push(`G1 X${x} Y${y}`);
          }
          x = p3.x;
          y = p3.y;
        } else if (item.type === "Q") {
          const p1 = { x, y };
          if (!firstMove) firstMove = { x, y };
          const p2 = { x: tf(item.x1), y: tf(item.y1) };
          const p3 = { x: tf(item.x), y: tf(item.y) };
          let tracer = new QuadricBezier({ p1, p2, p3 });
          let coords1 = tracer.trace({ step: 0.1 });
          for (let i = 0; i < coords1.length; i += 2) {
            x = coords1[i];
            y = coords1[i + 1];
            pendown();
            gcode.push(`G1 X${x} Y${y}`);
          }
          x = p3.x;
          y = p3.y;
        } else if (item.type === "Z") {
          gcode.push(`G1 X${firstMove.x} Y${firstMove.y}`);
          firstMove = null;
          penup();
        }
      });

      penup();
      gcode.push("G28 X Y");

      const data = gcode.join("\n");

      uploadData(outputFileName, data)
        .then(async () => {
          console.log("Upload DONE !", data.length);
          store.set("lineNumber", lineNumber);
          const ret = await sendCommand(`play sd/${outputFileName}`);
          console.log("PLAY", ret.data);
          let intervalID = setInterval(async () => {
            const play = await sendCommand(`progress`);
            if (play.data === "Not currently playing\r\n") {
              clearInterval(intervalID);
              console.log("PLAY DONE");
              isPlaying = false;
              if (queue.length) {
                setTimeout(function () {
                  writeMessage({ message: queue.shift() });
                }, 2000);
              }
            }
          }, 30000);
        })
        .catch((error) => {
          isPlaying = false;
          console.log("ERROR", error);
        });
    }
  });
};
