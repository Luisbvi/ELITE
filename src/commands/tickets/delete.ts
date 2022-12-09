import { EmbedBuilder } from "discord.js";
import { TicketModel } from "../../schema/Tickets";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "delete",
  permissions: ["ManageChannels"],
  botPermissions: ["ManageChannels"],
  run: async ({ message }) => {
    const ticket = await TicketModel.findOne({ channelId: message.channelId });
    if (!ticket) return;
    await message.delete();
    message.channel.send({
      embeds: [
        new EmbedBuilder({
          description: "Ticket will be deleted in few seconds",
        }).setColor("White"),
      ],
    });

    setTimeout(async () => {
      message.channel.delete();
      await TicketModel.deleteOne({ channelId: message.channelId });
    }, 10000);
  },
});
