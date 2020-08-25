const say = require("say");

const queue = [];
let saying = false;

module.exports = function sayMessage(message) {
  if (saying) {
    return queue.push(message);
  }
  saying = true;
  say.speak(message, null, null, () => {
    saying = false;
    if (queue.length) {
      sayMessage(queue.shift());
    }
  });
};
