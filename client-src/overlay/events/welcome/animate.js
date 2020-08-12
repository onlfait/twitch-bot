function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default function animate({ element, speed }) {
  if (element.dataset.running === "false") {
    console.log("remove element");
    element.remove();
    return;
  }

  let x = parseInt(element.style.left || 0);
  let y = parseInt(element.style.top || 0);

  let left = x + speed.x;
  let top = y + speed.y;

  const { width, height } = element.getBoundingClientRect();

  if (left < 0 || left + width > window.screen.width) {
    speed.x = -speed.x;
    speed.y = getRandomInt(15);
  }

  if (top < 0 || top + height > window.screen.height) {
    speed.x = getRandomInt(15);
    speed.y = -speed.y;
  }

  element.style.top = `${top}px`;
  element.style.left = `${left}px`;

  requestAnimationFrame(() => animate({ element, speed }));
}
