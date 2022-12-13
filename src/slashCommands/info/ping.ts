import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot ping"),
  run: ({ interaction, client }) => {
    return interaction.reply({ content: `\`${client.ws.ping}ms\`` });
  },
});
