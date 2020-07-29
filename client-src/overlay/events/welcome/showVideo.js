export default function showVideo({ id }) {
  const video = document.createElement("div");
  video.setAttribute("id", `video-${id}`);
  video.style.position = "absolute";
  video.style.left = "-500px";
  document.body.append(video);

  const player = new Twitch.Player(`video-${id}`, {
    width: 442,
    height: 442,
    video: id,
  });

  const duration = player.getDuration();

  player.seek(duration / 2);
  player.setVolume(0.5);

  player.addEventListener(Twitch.Player.PLAYING, () => {
    video.style.top = "200px";
    video.style.left = "200px";
    setTimeout(() => video.remove(), 1000 * 15);
  });
}
