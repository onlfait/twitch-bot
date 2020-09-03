const { Parser } = require("lw.svg-parser");
const { JSDOM } = require("jsdom");

// const SVGO = require("svgo");
// const svgo = new SVGO();

module.exports = class SVGParser extends Parser {
  loadFromNode(svg) {
    // const data = await svgo.optimize(svg);
    // console.log("---> svgo", data);
    this._parseEditor(svg);
    const dom = new JSDOM(svg);
    const element = dom.window.document.body.children[0];
    this.element = element;
    return this;
  }

  async toGCODE() {
    const root = await this.parse();

    const gcode = [];
    const { width, height } = this.document;

    console.log({ width, height });

    let isPendown = false;

    const pendown = () => {
      if (isPendown) return;
      gcode.push(`M4 S5 G4 P50`);
      isPendown = true;
    };

    const penup = () => {
      if (!isPendown) return;
      gcode.push(`M4 G4 P50`);
      isPendown = false;
    };

    penup();

    // TODO fait mieu bordel !!!

    console.log({ root });
    root.children.forEach((tag) => {
      tag.getPaths().forEach((path) => {
        if (!path.length) return;
        let { x, y } = path.points.shift();
        penup();
        gcode.push(`G1 X${x} Y${y}`);
        pendown();
        path.points.forEach(({ x, y }) => {
          gcode.push(`G1 X${x} Y${y}`);
        });
        penup();
      });
    });

    penup();
    gcode.push("G28 X Y");

    return gcode.join("\n");
  }
};
