const chalk = require("chalk");
const readline = require("readline");

module.exports = () => ({
  init({ channel, client }) {
    readline
      .createInterface({
        input: process.stdin,
      })
      .on("line", (line) => {
        client.say(channel, line);
      });
  },
  onMessage({ args }) {
    const { message, msg } = args;
    const color = msg._tags.get("color");
    const nick = msg._tags.get("display-name");
    console.log(chalk.hex(color)(`[${nick}]`), message);
  },
});
