import { ApplicationCommandOptionType } from "discord.js";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
    name: "emit",
    description: "emit an event",
    defaultMemberPermissions: "Administrator",
    options: [
      {
        name: "event",
        description: "event to emit",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "guildMemberAdd",
            value: "guildMemberAdd",
          },
        ],
        required: true,
      },
    ],

    run: ({ interaction, client, args }) => {
      const eventToEmit = args.getString("event");
      client.emit(eventToEmit, interaction.member);
    },
    
  });