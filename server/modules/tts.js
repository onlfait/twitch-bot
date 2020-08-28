const sayMessage = require("../libs/sayMessage");

const rewardId = "d4bc9cdb-4d94-43fb-bba2-154c3fc9b1a2";

module.exports = () => ({
  async onMessage({ message, msg }) {
    const cri = msg._tags.get("custom-reward-id");

    if (cri && cri === rewardId) {
      const nick = msg._tags.get("display-name");
      sayMessage(`Fab lab on le fait, ${nick} dit, ${message}.`);
    }
    // const tag = channel.replace("#", "@");
    // const regexp = new RegExp(`${tag}`, "i");
    //
    // if (message.match(regexp)) {
    //   sayMessage(message.replace(regexp, "on le fait"));
    // }
  },
});
