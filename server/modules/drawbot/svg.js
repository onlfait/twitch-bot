const { sendCommand, uploadData } = require("../../libs/smoothie");
const SVGParser = require("./SVGParser");
const axios = require("axios");

const parser = new SVGParser();
const outputFileName = "svg.gcode";

module.exports = async function svg(payload) {
  const { client, channel, msg, command } = payload;

  return new Promise((resolve, reject) => {
    if (!msg.isBroadcaster) {
      reject();
      return;
    }

    const url = command.args[0];

    if (!url) {
      const message = "Et le SVG je le trouve comment moi ?";
      client.say(channel, message);
      reject(message);
      return;
    }

    console.log("process SVG");

    axios
      .get(url)
      .then(async ({ data }) => {
        const gcode = await parser.loadFromNode(data).toGCODE();
        uploadData(outputFileName, gcode)
          .then(async () => {
            console.log("Upload DONE !", gcode.length);
            const ret = await sendCommand(`play sd/${outputFileName}`);
            console.log("PLAY", ret.data);
            let intervalID = setInterval(async () => {
              const play = await sendCommand(`progress`);
              if (play.data === "Not currently playing\r\n") {
                clearInterval(intervalID);
                console.log("PLAY DONE");
                resolve();
              }
            }, 30000);
          })
          .catch((error) => {
            console.log("ERROR", error);
            reject(error);
          });
      })
      .catch((error) => {
        console.log("SVG ERROR:", error);
        reject(error);
      });
  });
};
