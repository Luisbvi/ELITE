import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("emit an event")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("event to emit")
        .addChoices({
          name: "guildMemberAdd",
          value: "guildMemberAdd",
        })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  run: ({ interaction, client, args }) => {
    const eventToEmit = args.getString("event");
    client.emit(eventToEmit, interaction.member);
  },
});
