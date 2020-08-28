const { smoothieAddress } = require("../config");
const axios = require("axios");
const net = require("net");

function log(...args) {
  //eslint-disbale-next-line
  console.log("[smoothie]", ...args);
}

exports.sendCommand = async function (args) {
  log("Send command:", args);
  return await axios.post(`http://${smoothieAddress}/command`, `${args}\n`);
};

exports.uploadData = function (filename, data) {
  return new Promise(function (resolve, reject) {
    const client = new net.Socket();

    let state = "idle";

    client.connect(115, smoothieAddress, function () {
      log("Connected");
      state = "connected";
      client.write(`STOR OLD /sd/${filename}\n`);
    });

    client.on("data", function (inputData) {
      inputData = inputData.toString();

      if (!inputData.startsWith("+")) {
        reject(inputData);
        return;
      }

      log("Received: " + inputData);

      data += "\n";

      if (state === "connected") {
        client.write(`SIZE ${data.length}\n`);
        state = "filesizesend";
      } else if (state === "filesizesend") {
        client.write(data);
        state = "done";
      } else if (state === "done") {
        client.write(`DONE\n`);
      }
    });

    client.on("close", function () {
      log("Connection closed");
      client.destroy();
      resolve();
    });
  });
};
