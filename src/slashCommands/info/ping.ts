import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  name: "ping",
  description: "shows the bot ping",
  run: ({ interaction, client }) => {
    return interaction.reply({ content: `\`${client.ws.ping}ms\`` });
  },
});
