const store = require("../store");

const alias = ["clearUserList", "cul"];

module.exports = () => ({
  async onCommand(args) {
    const broadcaster = args.msg._tags.get("badges").includes("broadcaster");

    if (!broadcaster) {
      return;
    }

    store.set("users", []);
  },
});
