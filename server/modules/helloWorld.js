module.exports = () => ({
  onCommand({ client, command, args }) {
    const { channel, msg } = args;
    const nick = msg._tags.get("display-name");

    if (command.name == "hello") {
      client.say(channel, `Hello ${nick} :)`);
    }
  },
});
