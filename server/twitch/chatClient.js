const ChatClient = require("twitch-chat-client");

class ChatClientWrapper {
  constructor({ client, channel, io }) {
    this.io = io;
    this.client = client;
    this.channel = channel;
    this.plugins = new Set();

    this.client.onPrivmsg((...argsArray) => {
      const [channel, user, message, msg] = argsArray;
      const args = { channel, user, message, msg };

      let command = null;

      if (message[0] === "!") {
        const argv = message.slice(1).split(" ");
        const name = argv.shift();
        command = { name, args: argv };
      }

      this.plugins.forEach((plugin) => {
        const { onMessage, onCommand } = plugin();
        onMessage && onMessage({ channel, args, client, io });
        onCommand &&
          command &&
          onCommand({ channel, args, command, client, io });
      });
    });
  }

  use(plugin) {
    if (!this.plugins.has(plugin)) {
      this.plugins.add(plugin);
      const { init } = plugin();
      init && init({ client: this.client, channel: this.channel });
    }
  }
}

module.exports = function chatClient({ twitchClient, channel, io }) {
  const client = ChatClient.forTwitchClient(twitchClient);

  client.onRegister(() => {
    client.join(channel);
  });

  client.connect();

  return new ChatClientWrapper({ client, channel, io });
};
