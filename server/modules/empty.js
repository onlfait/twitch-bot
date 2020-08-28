module.exports = () => ({
  // args: { channel, user, message, msg, client, io, command }
  async onMessage() {
    console.log("empty...");
  },
  // args: { channel, user, message, msg, client, io, command, done }
  async onCommand() {
    console.log("empty...");
  },
});
