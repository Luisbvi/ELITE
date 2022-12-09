import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "wap",
  description: "ADMIN ONLY: Ticket for worker application",
  permissions: ["Administrator"],


  run: async ({ message }) => {
    const embed = new EmbedBuilder({
      author: {
        name: "Apply to become a worker",
        icon_url: message.guild.iconURL(),
      },
      thumbnail: { url: message.guild.iconURL() },
      description:
        "We are hiring **Venezuelan** workers! :flag_ve: :flag_ve: Open a ticket here and fill in the application form send by one of our staff members.\n\nPlease keep in mind we require a deposit. More info in ticket.",
    }).setColor("White");

    const row = new ActionRowBuilder<ButtonBuilder>({
      components: [
        new ButtonBuilder({
          customId: "become-a-worker",
          label: "Apply to become a worker",
          style: ButtonStyle.Primary,
          emoji: "🎫",
        }),
      ],
    });
    message.delete()
    message.channel.send({ embeds: [embed], components: [row] });
  },
});
