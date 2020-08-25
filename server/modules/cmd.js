const add = require("./cmd/add");
const store = require("../store");

let commands = { add };

module.exports = () => ({
  async onCommand(args) {
    const cmd = args.command.name;

    if (cmd === "cmd") {
      const subcmd = args.command.args.shift();
      const func = commands[subcmd];
      func && func(args);
      return;
    }

    commands = store.get("commands", {});
    const command = commands[cmd];
    const { client, channel } = args;

    if (!command) {
      client.say(channel, `La commande "${cmd}" est inconnue.`);
      return;
    }

    if (command.type === "text") {
      client.say(channel, command.value);
    }
  },
});
