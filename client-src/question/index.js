import socket from "./socket";

const $app = document.querySelector("#app");

const timeOptions = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
};

const timeFormat = new Intl.DateTimeFormat("fr-CH", timeOptions);

const addQuestion = ({ id, time, nick, message }) => {
  const $question = document.createElement("div");
  const $time = document.createElement("span");
  const $nick = document.createElement("span");
  const $message = document.createElement("span");
  const $delete = document.createElement("span");
  $question.classList.add("question");
  $time.classList.add("time");
  $nick.classList.add("nick");
  $message.classList.add("message");
  $delete.classList.add("delete");
  $time.innerText = timeFormat.format(time);
  $nick.innerText = nick;
  $message.innerText = message;
  $delete.innerText = "❌";
  $question.appendChild($time);
  $question.appendChild($nick);
  $question.appendChild($message);
  $question.appendChild($delete);
  $app.appendChild($question);

  $delete.addEventListener("click", () => {
    socket.emit("questions.remove", id);
    $question.remove();
  });
};

socket.emit("questions.getAll");

socket.on("questions.push", addQuestion);
socket.on("questions.getAll", (questions) => {
  questions.forEach(addQuestion);
});
