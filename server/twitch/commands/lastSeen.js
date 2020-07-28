const users = new Map();

module.exports = ({ args, client, channel }) => {
  const requestedUser = args.shift();

  if (!users.has(requestedUser)) {
    client.say(channel, `${requestedUser} est le/la bienvenu.`);
    return;
  }

  const { date } = users.get(requestedUser);

  client.say(
    channel,
    `${requestedUser} à été vu la derrnière fois le ${date}.`
  );
};
