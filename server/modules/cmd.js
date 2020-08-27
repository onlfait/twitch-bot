const store = require("../store");
const add = require("./cmd/add");
const sayMessage = require("./libs/sayMessage");

const commands = { add };

const splitChar = "/";

module.exports = () => ({
  async onCommand(args) {
    const cmd = args.command.name;

    if (cmd === "cmd") {
      const subcmd = args.command.args.shift();
      const func = commands[subcmd];
      func && func(args);
      return;
    }

    const { client, channel } = args;
    const commandList = store.get("commands", []).filter((c) => c.name === cmd);

    if (!commandList.length) {
      client.say(channel, `La commande "${cmd}" est inconnue.`);
      return;
    }

    commandList.forEach((command) => {
      const sep = args.command.rawArgs.includes(splitChar) ? splitChar : " ";
      const cmdArgs = args.command.rawArgs.split(sep);

      console.log({ cmdArgs });
      const value = command.value.replace(/(\$[0-9])/g, (match, p1) => {
        return cmdArgs[p1[1]];
      });

      if (command.type === "text") {
        client.say(channel, value);
      }

      if (command.type === "tts") {
        sayMessage(value);
      }
    });
  },
});
