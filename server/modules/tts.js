const say = require("say");

module.exports = () => ({
  async onMessage({ args }) {
    const { channel, message } = args;
    const tag = channel.replace("#", "@");
    const regexp = new RegExp(`${tag}`, "i");

    if (message.match(regexp)) {
      say.speak(message.replace(regexp, "on le fait"));
    }
  },
});
