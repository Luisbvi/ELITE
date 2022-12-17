import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GuildModel } from "../../schema/guild";
import { QuestModel } from "../../schema/quest";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("quest")
    .setDescription("Quote Quest")
    .addStringOption((option) =>
      option.setName("quest_choices").setDescription("...").setRequired(true)
    ),
  async run({ interaction, args }) {
    await interaction.deferReply({ ephemeral: true });
    const questsChoices = args
      .getString("quest_choices")
      .split(",")
      .map((quest) => quest.trim().toLowerCase());

    const customer = interaction.member;

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

    const rate = await GuildModel.findOne({ guildId: interaction.guildId })[
      "07gp"
    ];

    const questData = (await QuestModel.findOne()).quests;

    const quests = questsChoices.map((choice) => {
      return questData.find((quest) => {
        return (
          quest.name.toLowerCase() === choice ||
          quest.alias.find((questname) => questname.toLowerCase() === choice)
        );
      });
    });

    let price = 0;

    quests.forEach((quest) => {
      price += quest?.price ?? 0;
    });

    const totalgold = price / rate;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Questing Calculator",
        iconURL:
          "https://oldschool.runescape.wiki/images/thumb/Quests.png/130px-Quests.png?f5120",
      })
      .setColor("White")
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setThumbnail(interaction.guild.iconURL());

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

    interaction.editReply({ embeds: [embed] });
  },
});
