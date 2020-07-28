import socket from "./socket";

const getMeButton = document.querySelector("#getMe");
const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");

socket.on("twitch.helix.users.getMe.response", (user) => {
  console.log("USER >>>", user);
});

getMeButton.addEventListener("click", () => {
  console.log("getMe Button clicked!");
  socket.emit("twitch.helix.users.getMe", true);
});

leftButton.addEventListener("click", () => {
  console.log("left + 10");
  socket.emit("smoothie.move.left", 10);
});

rightButton.addEventListener("click", () => {
  console.log("right + 10");
  socket.emit("smoothie.move.right", 10);
});
