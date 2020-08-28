const path = require("path");

module.exports = {
  port: 4343,
  smoothieAddress: "192.168.1.143",
  isDev: process.env.NODE_ENV !== "production",
  publicPath: path.resolve(__dirname, "..", "public"),
  clientPath: path.resolve(__dirname, "..", "client-dist"),
};
