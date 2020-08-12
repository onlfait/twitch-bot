const addCommand = require("./cmd-add");
const runCommand = require("./cmd-run");

module.exports = () => ({
  async onMessage({ client, args }) {
    const { message } = args;

    if (message[0] !== "!") {
      return;
    }

    const params = message.slice(1).split(" ");
    const cmd = params.shift();

    if (cmd === "update") {
      const axios = require("axios");
      const store = require("../store");
      const commands = store.get("commands", {});
      axios({
        method: "post",
        url: "http://localhost/index.php",
        data: "data=" + JSON.stringify(commands),
      }).catch(function (error) {
        console.log(">>>", { error });
      });
    }

    if (cmd === "add") {
      addCommand({ client, args }, { cmd, params });
    } else {
      runCommand({ client, args }, { cmd, params });
    }
  },
});
