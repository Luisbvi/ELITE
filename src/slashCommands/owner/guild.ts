import { EmbedBuilder } from "discord.js";
import SlashCommand from "../../structures/classes/SlashCommand";
import { GuildModel } from "../../schema/guild";

export default new SlashCommand({
  name: "guild",
  description: "Add this guild to the database",
  owner: true,
  async run({ interaction }) {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });
    const GuildData = await GuildModel.findOne({
      guildId: interaction.guildId,
    });
    const embed = new EmbedBuilder({}).setColor("#36393F");

    if (!GuildData) {
      interaction.editReply({
        embeds: [embed.setDescription("⚠ | Creating Guild's Database...")],
      });

      await GuildModel.create({
        guildId: interaction.guildId,
        orderNumbers: 0,
      });

      interaction.editReply({
        embeds: [
          embed.setDescription("✅ | Guild's Database created succesfully."),
        ],
      });
    } else {
      interaction.editReply({
        embeds: [
          embed.setDescription(
            ":x: | This Guild is already registered in our database"
          ),
        ],
      });
    }
  },
});
