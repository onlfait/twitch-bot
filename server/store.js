const Conf = require("conf");

const defaults = {
  users: {},
  commands: {},
  lineNumber: 0,
  questions: [],
};

module.exports = new Conf({ defaults });
