const store = require("../store");

const alias = ["clearUserList", "cul"];

module.exports = () => ({
  async onCommand({ msg, command }) {
    if (msg.isBroadcaster && alias.includes(command.name)) {
      store.set("users", []);
    }
  },
});
