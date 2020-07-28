const twitchClient = require("../twitch/client")();

const users = new Map();

module.exports = () => ({
  onMessage({ client, args, io }) {
    const { user, channel, msg } = args;
    const uid = msg._tags.get("user-id");
    const nick = msg._tags.get("display-name");

    if (!users.has(user)) {
      users.set(user, { time: Date.now() });
      client.say(channel, `Welcome @${nick} fablabOnlfait`);
    }

    twitchClient.helix.users.getUserById(uid).then(({ _data }) => {
      const url = _data["profile_image_url"];
      io.emit("plugin.welcome.show.picture", { nick, url });
    });
  },
});
