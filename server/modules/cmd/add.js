const store = require("../../store");

const types = ["text", "tts"];

// !cmd add type name ...value
module.exports = ({ client, channel, command, msg }) => {
  if (!msg.isBroadcaster) return;

  let [type, name, ...value] = command.args;

  value = value.join(" ");

  if (!types.includes(type)) {
    client.say(channel, `La type de commande "${type}" est invalide.`);
    return;
  }

  if (!name || !value) {
    client.say(channel, `Les nom/valeur de la commande sont obligatoire!`);
    return;
  }

  const commands = store.get("commands", {});
  const commandObject = commands[name];

  if (commandObject) {
    client.say(channel, `La commande "${name}" existe déjà.`);
    return;
  }

  commands.push({ type, name, value });
  store.set("commands", commands);
};
