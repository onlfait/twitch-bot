const store = require("../store");
const { v4: uuid } = require("uuid");

module.exports = () => ({
  async onMessage({ message, msg, io }) {
    if (!message.includes("?")) return;

    const nick = msg._tags.get("display-name");
    const questions = store.get(`questions`, []);
    const question = { id: uuid(), time: Date.now(), nick, message };

    questions.push(question);
    store.set(`questions`, questions);
    io.emit("questions.push", question);
  },
});
