const Conf = require("conf");

const defaults = {
  users: {},
  commands: {},
};

module.exports = new Conf({ defaults });
