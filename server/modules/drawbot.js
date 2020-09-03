const { sendCommand } = require("../libs/smoothie");

const write = require("./drawbot/write");
const move = require("./drawbot/move");
const svg = require("./drawbot/svg");

const store = require("../store");

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
  resetLine: () => Promise.resolve(store.set("lineNumber", 1)),
  move,
  write,
  svg,
};

const queue = [];
let isPlaying = false;

function processQueue() {
  isPlaying = false;
  const [funcName, payload] = queue.shift() || [];
  if (funcName === "onMessage") {
    onMessage(payload);
  } else if (funcName === "onCommand") {
    onCommand(payload);
  }
}

function onMessage(payload) {
  const { msg } = payload;
  const rewardId = msg._tags.get("custom-reward-id");

  if (!rewardId) return;

  const commandFunc = rewardCommands[rewardId];

  if (!commandFunc) return;

  if (isPlaying) {
    queue.push(["onMessage", payload]);
    return;
  }

  isPlaying = true;

  commandFunc(payload)
    .then(processQueue)
    .catch((error) => {
      console.log("CMD ERROR:", error);
      processQueue();
    });
}

function onCommand(payload) {
  const cmd = payload.command.name;
  const commandFunc = commands[cmd];

  if (!commandFunc || rewardCommandsValues.includes(cmd)) return;

  payload.done();

  if (isPlaying) {
    queue.push(["onCommand", payload]);
    return;
  }

  isPlaying = true;

  commandFunc(payload)
    .then(processQueue)
    .catch((error) => {
      console.log("CMD ERROR:", error);
      processQueue();
    });
}

module.exports = () => ({ onMessage, onCommand });
