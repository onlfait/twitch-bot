const { sendCommand } = require("../libs/smoothie");
const move = require("./drawbot/move");
const write = require("./drawbot/write");

const F = "F10000";

const rewardCommands = {
  "51562089-9be9-42fa-801e-2a3cc272a80b": write,
};

const rewardCommandsValues = ["write"];

const commands = {
  home: () => sendCommand(`G28 X Y ${F}`),
  clear: () => sendCommand(`M999`),
  penup: () => sendCommand(`M4`),
  pendown: () => sendCommand(`M4 S5`),
  move,
  write,
};

module.exports = () => ({
  onMessage(payload) {
    const { msg } = payload;
    const rewardId = msg._tags.get("custom-reward-id");

    if (!rewardId) return;

    const commandFunc = rewardCommands[rewardId];

    if (!commandFunc) return;

    commandFunc(payload);
  },
  onCommand(payload) {
    const cmd = payload.command.name;
    const commandFunc = commands[cmd];

    if (!commandFunc || rewardCommandsValues.includes(cmd)) return;

    commandFunc(payload);
    payload.done();
  },
});
