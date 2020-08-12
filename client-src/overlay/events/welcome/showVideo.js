const queue = [];
let playing = false;
const duration = 30; // seconds
const queueDelay = 5000;

function createVideo(id) {
  const video = document.createElement("div");
  video.setAttribute("id", `video-${id}`);
  video.style.position = "absolute";
  video.style.display = "none";
  document.body.append(video);
  return video;
}

export default function showVideo(settings) {
  console.log({ settings });

  if (playing) {
    queue.push(settings);
    return;
  }

  const { id, timestamp } = settings;

  playing = true;

  const video = createVideo(id);
  const player = new Twitch.Player(`video-${id}`, {
    width: "660px",
    height: "470px",
    video: id,
  });

  const remove = () => {
    playing = false;
    video.remove();

    console.log("remove video");

    if (queue.length) {
      const video = queue.shift();
      console.log("shift >>> ", video);
      setTimeout(() => showVideo(video), queueDelay);
    }
  };

  player.addEventListener(Twitch.Player.READY, () => {
    video.style.top = "0px";
    video.style.right = "0px";
    video.style.display = "block";
    setTimeout(remove, 1000 * duration);
  });

  player.addEventListener(Twitch.Player.PLAYING, () => {
    player.seek(timestamp / 2);
  });
}
