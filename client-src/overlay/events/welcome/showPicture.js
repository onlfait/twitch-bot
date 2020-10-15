import animate from "./animate";

const timeout = 15; //s

export default function showPicture({ nick, url }) {
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

  animate({ element, speed: { x: 15, y: 0 } });

  setTimeout(() => {
    element.dataset.running = false;
  }, 1000 * timeout);
}
