const store = require("../store");

const types = ["text"];
const allowedUsers = ["fablab_onlfait"];

module.exports = ({ client, args }, { params }) => {
  const commands = store.get("commands", {});
  const { channel, user } = args;

  if (!allowedUsers.includes(user)) {
    return;
  }

  const [type, name, ...words] = params;
  const value = words.join(" ");

  if (!types.includes(type)) {
    client.say(channel, `La type de commande "${type}" est invalide.`);
    return;
  }

  if (!name || !value) {
    client.say(channel, `Les nom/valeur de la commande sont obligatoire!`);
    return;
  }

  if (commands[name]) {
    client.say(channel, `La commande "${name}" existe déjà.`);
    return;
  }

  commands[name] = { type, name, value };
  store.set("commands", commands);

  console.log(commands);

  return;
};
