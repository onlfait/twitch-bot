const store = require("../store");

const alias = ["clearUserList", "cul"];

module.exports = () => ({
  async onCommand(args) {
    const cmd = args.command.name;
    const broadcaster = args.msg._tags.get("badges").includes("broadcaster");

    if (!broadcaster || !alias.includes(cmd)) {
      return;
    }

    store.set("users", []);
  },
});
