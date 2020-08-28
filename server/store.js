const Conf = require("conf");

const defaults = {
  users: {},
  commands: {},
  lineNumber: 0,
};

module.exports = new Conf({ defaults });
