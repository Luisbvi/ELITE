import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
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

    const questData = (await QuestModel.findOne()).quests;

    const questRequired = questData.filter((quest) => {
      questsChoices.includes(quest.name.toLowerCase());
    });

    console.log(questRequired);
    let price = 0;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Questing Calculator",
        iconURL:
          "https://oldschool.runescape.wiki/images/thumb/Quests.png/130px-Quests.png?f5120",
      })
      .setColor("White")
      .addFields({
        name: "Discount",
        value: discount ? `\`${discount} has been applied \`` : "`No Discount`",
      });

    questsChoices.forEach((quest) => {
      embed.addFields({
        name: "Quest Requested",
        value: "test",
      });
    });

    interaction.editReply({ embeds: [embed] });
  },
});
