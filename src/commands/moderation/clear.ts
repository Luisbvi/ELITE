import { TextChannel } from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "clear",
  botPermissions: ["ManageMessages"],
  permissions: ["ManageChannels"],

  async run({ message, args }) {
    const messages = await message.channel.messages.fetch();

    const channel = message.guild.channels.cache.get(
      message.channelId
    ) as TextChannel;

    channel.bulkDelete(messages.size + 1, true);
  },
});
