async function twitchHandle(twitchClient, api, ...args) {
  const path = api.split(".");
  let parent = twitchClient;
  let func = parent[path.shift()];

  for (let i = 0; i < path.length; i++) {
    if (!func) break;
    parent = func;
    func = func[path[i]];
  }

  if (!func || typeof func !== "function") {
    return new Error(`Undefined API "${api}"`);
  }

  return await func.call(parent, ...args);
}

module.exports = function ({ twitchClient, socket } = {}) {
  return async function twitchMiddleware(packet, next) {
    let [api, ...args] = packet;

    if (api.startsWith("twitch.")) {
      api = api.slice(7);

      let error = null;
      let data = null;

      try {
        data = await twitchHandle(twitchClient, api, ...args);
      } catch (err) {
        error = err;
      }

      socket.emit(`twitch.${api}.response`, { error, data });
    }

    return next();
  };
};
