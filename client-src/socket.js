import io from "socket.io-client";
import { parse } from "query-string";

const socket = io();

export default socket;

socket.on("twitch.auth.redirect", (url) => {
  window.open(url);
});

const query = parse(location.hash || location.search);

if (query.error && query.error_description) {
  socket.emit("twitch.auth.error", query.error_description);
  setTimeout(() => window.close(), 500);
}

if (query.access_token) {
  socket.emit("twitch.auth.success", JSON.stringify(query));
  setTimeout(() => window.close(), 500);
}
