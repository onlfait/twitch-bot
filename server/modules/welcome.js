const twitchClient = require("../twitch/client")();

const users = new Map();

module.exports = () => ({
  async onMessage({ client, args, io }) {
    const { user, channel, msg } = args;
    const uid = msg._tags.get("user-id");
    const nick = msg._tags.get("display-name");

    if (users.has(user)) {
      return;
    }

    users.set(user, { time: Date.now() });
    client.say(channel, `Welcome @${nick} fablabOnlfait`);

    let userInfo = await twitchClient.helix.users.getUserById(uid);
    const url = userInfo._data["profile_image_url"];

    io.emit("plugin.welcome.show.picture", { nick, url });

    const videoInfo = await twitchClient.helix.videos.getVideosByUser(uid);
    const lastVideo = videoInfo.data.shift();

    if (lastVideo) {
      client.say(
        channel,
        `@${nick} is streaming on twitch.tv/${userInfo._data["login"]}`
      );
      client.say(channel, `Last video from @${nick}: ${lastVideo._data.url}`);

      io.emit("plugin.welcome.show.video", { id: lastVideo._data.id });
    }
  },
});
