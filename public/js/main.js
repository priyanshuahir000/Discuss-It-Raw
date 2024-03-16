const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const messageSound = new Audio("../audio/message.wav");
let isUserInteracted = false;

document.addEventListener("click", () => {
  isUserInteracted = true;
});

document.addEventListener("keydown", () => {
  isUserInteracted = true;
});

function playMessageSound() {
  if (isUserInteracted) {
    messageSound.play();
  }
}

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  outputMsg(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("chatMsg", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMsg(message) {
  messageSound.preload = "auto";
  playMessageSound();
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} </p>
  <p class="text">
    ${message.text}
  </p><span>${message.time}</span>`;
  chatMessage.appendChild(div);
  chatMessage.appendChild(document.createElement("br"));
}

function outputRoomName(room) {
  document.getElementById("room-name").innerHTML = room;
}

function outputUsers(users) {
  document.getElementById("users").innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
