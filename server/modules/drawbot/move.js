const { sendCommand } = require("../../libs/smoothie");

module.exports = async ({ client, channel, command }) => {
  let valid = false;

  const params = command.args.map((arg) => {
    arg = arg.toUpperCase().trim();

    if (arg === "MOVE") {
      arg = "G0";
    } else if (arg === "PENUP") {
      arg = "M4";
    } else if (arg === "PENDOWN") {
      arg = "M4 S5";
    } else if (!arg.match(/^[XYF](\+|-)?[0-9]+(\.[0-9]+)?$/)) {
      return null;
    }

    valid = true;
    return arg;
  });

  const output = `91 G0 ${params.join(" ")}`;

  if (valid) {
    const lines = output.split("G");
    for (let i = 0; i < lines.length; i++) {
      await sendCommand(`G${lines[i]}`);
    }
  } else {
    client.say(channel, "Invalid format!");
  }
};
