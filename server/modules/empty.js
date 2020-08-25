module.exports = () => ({
  async onMessage({ channel, user, message, msg, client, io, command } = {}) {
    console.log("empty...");
  },
  async onCommand({ channel, user, message, msg, client, io, command } = {}) {
    console.log("empty...");
  },
});
