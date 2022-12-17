import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "ticketsystem",
  description: "Set ticket system for services",
  permissions: ["Administrator"],
  run({ message }) {
    const embed = new EmbedBuilder()
      .setTitle(`TICKET SYSTEM`)
      .setDescription(
        `Welcome to ${message.guild.name}. All our services are hand made and done via
      **Nord VPN**. We also take orders on proxies on your request. For more information, please react below.`
      )
      .setColor("White");

    const menu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("services")
        .setPlaceholder("Select an option")
        .addOptions(
          {
            label: "Services",
            value: "services",
            description: "Open a ticket to order a services",
            emoji: "<:Skills:995431400339685516>",
          },
          {
            label: "Gold",
            description: "Open a ticket to buy gold",
            value: "gold",
            emoji: "<:coins_icon:853392355067035709>",
          },
          {
            label: "Accounts",
            description: "Open a ticket to buy accounts",
            value: "accounts",
            emoji: "<:BTC:853398763392466944>",
          },
          {
            label: "Graphic Desing",
            description: "Open a ticket to order a graphic desing",
            value: "grpahic",
            emoji: "🦦",
          }
        )
    );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ping")
        .setLabel("Bot is Online?")
        .setEmoji("📶")
        .setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({ embeds: [embed], components: [menu, button] });
  },
});
