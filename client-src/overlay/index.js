import io from "socket.io-client";

const socket = io();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function animate({ element, speed }) {
  if (!element.dataset.running) {
    return;
  }

  let x = parseInt(element.style.left || 0);
  let y = parseInt(element.style.top || 0);

  let left = x + speed.x;
  let top = y + speed.y;

  if (left < 0 || left + 200 > window.screen.width) {
    speed.x = -speed.x;
    speed.y = getRandomInt(15);
  }

  if (top < 0 || top + 200 > window.screen.height) {
    speed.x = getRandomInt(15);
    speed.y = -speed.y;
  }

  element.style.top = `${top}px`;
  element.style.left = `${left}px`;

  requestAnimationFrame(() => animate({ element, speed }));
}

socket.on("plugin.welcome.show.picture", ({ nick, url }) => {
  const element = document.createElement("div");
  const nickname = document.createElement("span");
  const img = document.createElement("img");

  img.setAttribute("src", url);

  element.classList.add("user-picture");
  element.classList.add(`user-nick-${nick}`);
  nickname.classList.add("nick");
  nickname.innerText = nick;

  element.append(img);
  element.append(nickname);
  document.body.append(element);

  element.dataset.running = true;

  requestAnimationFrame(() => animate({ element, speed: { x: 15, y: 0 } }));

  setTimeout(() => {
    element.dataset.running = false;
    element.remove();
  }, 1000 * 15);
});
