import socket from "./socket";

const getMeButton = document.querySelector("#getMe");

socket.on("twitch.helix.users.getMe.response", (user) => {
  console.log("USER >>>", user);
});

getMeButton.addEventListener("click", () => {
  console.log("getMe Button clicked!");
  socket.emit("twitch.helix.users.getMe", true);
});
