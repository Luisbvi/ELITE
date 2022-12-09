import { TextInputStyle } from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "ping",
  owner: true,

  run: ({ message, client }) => {
    message.reply({ content: `\`${client.ws.ping}ms\`` });
  },
});
