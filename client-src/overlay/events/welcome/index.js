import showPicture from "./showPicture";
import showVideo from "./showVideo";

export default function welcome({ socket }) {
  socket.on("plugin.welcome.show.picture", showPicture);
  socket.on("plugin.welcome.show.video", showVideo);
}
