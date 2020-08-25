const store = require("../../store");

const types = ["text"];
const allowedUsers = ["fablab_onlfait"];

module.exports = ({ client, channel, user, command }) => {
  console.log({ channel, user, command });

  if (!allowedUsers.includes(user)) {
    return;
  }

  const [type, name, value] = command.args;

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

  commands[name] = { type, name, value };
  console.log(">>>>>>>>>>>", commands);
  store.set("commands", commands);
};
