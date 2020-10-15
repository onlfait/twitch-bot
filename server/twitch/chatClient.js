const ChatClient = require("twitch-chat-client");

class ChatClientWrapper {
  constructor({ client, channel, io }) {
    this.io = io;
    this.client = client;
    this.channel = channel;
    this.plugins = new Set();

    this.client.onPrivmsg((channel, user, message, msg) => {
      let command = null;

      if (message[0] === "!") {
        const args = message.slice(1).split(" ");
        const rawArgs = args.slice(1).join(" ");
        command = { name: args.shift(), args, rawArgs };
      }

      const payload = { channel, user, message, msg, client, io };

      const badges = msg._tags.get("badges");
      msg.isBroadcaster = badges && badges.includes("broadcaster");

      let commandCatch = false;
      let done = () => (commandCatch = true);

      this.plugins.forEach((plugin) => {
        const { onMessage, onCommand } = plugin();
        onMessage && onMessage(payload);
        command && onCommand && onCommand({ ...payload, command, done });
      });

      if (command && !commandCatch) {
        client.say(channel, `La commande "${command.name}" est inconnue.`);
      }
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
