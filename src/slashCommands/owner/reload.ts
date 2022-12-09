import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { client } from "../..";
import SlashCommand from "../../structures/classes/SlashCommand";
import { AntiCrash } from "../../structures/handlers/antiCrash";
import { CommandsHandler } from "../../structures/handlers/CommandsHandler";
import { EventsHandler } from "../../structures/handlers/EventsHandler";
import { SlashCommandHandler } from "../../structures/handlers/SlashCommandHandler";

export default new SlashCommand({
  name: "reload",
  description: "Reload bot files",
  owner: true,
  options: [
    {
      name: "module",
      description: "Module to reload",
      choices: [
        {
          name: "Commands",
          value: "commands",
        },
        { name: "Slash Commands", value: "slash" },
        { name: "Events", value: "events" },
      ],
      type: ApplicationCommandOptionType.String,
    },
  ],

  async run({ interaction, args }) {
    const module = args.getString("module");
    let options = "Commands and Events";
    const { loadEvents } = new EventsHandler();
    const { loadCommands } = new CommandsHandler();
    const { loadSlashCommands } = new SlashCommandHandler();
    const { loadAntiCrash } = new AntiCrash();
    try {
      switch (module) {
        case "commands":
          {
            options = "Commands";
            await loadCommands(client);
          }
          break;

        case "slash":
          {
            options = "Slash Commands";
            await loadSlashCommands(client);
          }
          break;

        case "events":
          {
            options = "Events";
            await loadEvents(client);
          }
          break;

        default:
          {
            await loadEvents(client);
            await loadAntiCrash(client);
            await loadCommands(client);
            await loadCommands(client);
          }
          break;
      }
      interaction.reply({
        embeds: [
          new EmbedBuilder({
            fields: [{ name: ` ✅ ${options} reloaded`, value: "> *Okay!*" }],
          }).setColor("White"),
        ],
      });
    } catch (error) {
      interaction.reply({
        content: `**An error occurred while reloading the files!**\nSee the console for more details`,
      });
      console.log(error);
    }
  },
});
