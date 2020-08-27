const twitchClient = require("../twitch/client")();
const sayMessage = require("./libs/sayMessage");
const store = require("../store");

module.exports = () => ({
  async onMessage({ client, user, channel, msg, io }) {
    const users = store.get(`users`);

    if (users.includes(user)) {
      return;
    }

    users.push(user);
    store.set(`users`, users);

    const uid = msg._tags.get("user-id");
    const nick = msg._tags.get("display-name");

    client.say(channel, `Bienvenue à toi @${nick} fablabOnlfait`);
    sayMessage(`${nick} viens d'atterrir dans le tchatte`);

    let userInfo = await twitchClient.helix.users.getUserById(uid);
    const url = userInfo._data["profile_image_url"];

    io.emit("plugin.welcome.show.picture", { nick, url });

    const videoInfo = await twitchClient.helix.videos.getVideosByUser(uid);
    const lastVideo = videoInfo.data[0];

    if (lastVideo) {
      const matches = lastVideo._data["duration"].match(
        /([0-9]+h)?([0-9]+m)?([0-9]+s)/i
      );

      if (!matches) {
        throw new Error("Invalid date format!");
      }

      const [, h, m, s] = matches;

      let timestamp = parseInt(s);
      if (m) timestamp += parseInt(m) * 60;
      if (h) timestamp += parseInt(h) * 3600;

      client.say(
        channel,
        `@${nick} fait des directs sur twitch.tv/${userInfo._data["login"]}
        Aller voir la derrnière vidéo de ${nick}: ${lastVideo._data.url}`
      );

      io.emit("plugin.welcome.show.video", {
        ...lastVideo._data,
        channel: user,
        timestamp,
        nick,
      });
    }
  },
});
