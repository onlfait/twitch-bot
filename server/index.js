const express = require("express");
const { Server } = require("http");
const socket = require("socket.io");
const store = require("./store");

const twitchMiddleware = require("./twitch/twitchMiddleware");
const chatClient = require("./twitch/chatClient");

const { isDev, port, clientPath, publicPath } = require("./config");

const app = express();
const server = Server(app);
const io = socket(server);

const channel = "fablab_onlfait";

const twitchClient = require("./twitch/client")({
  clientId: "3ydnn6uit4578idry67vudwxhyo4zi",
  redirectURI: `http://localhost:${port}/main`,
  io,
});

if (isDev) {
  require("./devMiddleware")(app);
} else {
  app.use(express.static(clientPath));
}

app.use(express.static(publicPath));

server.listen(port, async () => {
  console.log(`listening on http://localhost:${port}`);
});

let chat = null;

io.on("connection", (socket) => {
  socket.use(twitchMiddleware({ twitchClient, socket }));

  socket.on("questions.getAll", () => {
    socket.emit("questions.getAll", store.get("questions", []));
  });

  socket.on("questions.remove", (id) => {
    store.set(
      "questions",
      store.get("questions", []).filter((q) => q.id !== id)
    );
  });

  if (!chat) {
    chat = chatClient({ twitchClient, channel, io });
    chat.use(require("./modules/clearUserList"));
    chat.use(require("./modules/drawbot"));
    chat.use(require("./modules/cliChat"));
    chat.use(require("./modules/welcome"));
    chat.use(require("./modules/question"));
    chat.use(require("./modules/cmd"));
    chat.use(require("./modules/tts"));
  }
});
