import { EmbedBuilder } from "discord.js";
import { GuildModel } from "../../schema/guild";
import { QuestModel } from "../../schema/quest";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "q",
  async run({ message }) {
    const args = message.content.slice(2).trim().split(",");
    const questsChoices = args.map((quest) => quest.trim().toLowerCase());

    const customer = message.member;

    const discountRoles = {
      "856961746896289793": 2,
      "929958088780447754": 4,
      "929958488849932318": 6,
      "856961852180004904": 8,
      "856962053640945705": 10,
      "856962276526915605": 12,
    };
    const discountRol = customer.roles.cache.find(
      (rol) => discountRoles[rol.id]
    )?.id;
    const discount: number = discountRoles[discountRol];

    const guildData = await GuildModel.findOne({ guildId: message.guildId });

    const questData = (await QuestModel.findOne()).quests;

    const quests = questsChoices.map((choice) => {
      return questData.find((quest) => {
        return (
          quest.name?.toLowerCase() === choice ||
          quest.alias.find((questname) => questname?.toLowerCase() === choice)
        );
      });
    });

    let price = 0;

    quests.forEach((quest) => {
      price += quest?.price ?? 0;
    });

    const totalgold = price / guildData["07rate"];

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Questing Calculator",
        iconURL:
          "https://oldschool.runescape.wiki/images/thumb/Quests.png/130px-Quests.png?f5120",
      })
      .setColor("White")
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setThumbnail(message.guild.iconURL());

    embed.addFields(
      {
        name: "__Quest Requested__",
        value: `${quests
          .map((quest) => quest?.name ?? "Unknow Quest")
          .join("\n")}`,
      },
      {
        name: "Discount",
        value: discount ? `\`${discount} has been applied \`` : "`No Discount`",
      },
      {
        name: `<:coins_icon:853392355067035709> ${
          discount
            ? (totalgold - (totalgold * discount) / 100).toFixed(3)
            : totalgold.toFixed(3)
        }M`,
        value: "\u200B",
        inline: true,
      },
      {
        name: `<:BTC:853398763392466944> ${
          discount
            ? (price - (price * discount) / 100).toFixed(2)
            : price.toFixed(2)
        }$`,
        value: "\u200B",
        inline: true,
      }
    );

    message.channel.send({ embeds: [embed] });
  },
});
