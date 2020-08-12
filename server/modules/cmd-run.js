const store = require("../store");

module.exports = ({ client, args }, { cmd }) => {
  const commands = store.get("commands", {});
  const { channel } = args;
  const command = commands[cmd];

  if (!command) {
    client.say(channel, `La commande "${cmd}" est inconnue.`);
    return;
  }

  if (command.type === "text") {
    client.say(channel, command.value);
  }
};
