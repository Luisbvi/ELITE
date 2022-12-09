import { EmbedBuilder } from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";
import { AntiCrash } from "../../structures/handlers/antiCrash";
import { CommandsHandler } from "../../structures/handlers/CommandsHandler";
import { EventsHandler } from "../../structures/handlers/EventsHandler";
import { SlashCommandHandler } from "../../structures/handlers/SlashCommandHandler";

export default new PrefixCommand({
  name: "reload",
  description: "Reload the bot",
  owner: true,

  async run({ message, client, args }) {
    let options = "Commands and Events";
    const { loadEvents } = new EventsHandler();
    const { loadCommands } = new CommandsHandler();
    const { loadSlashCommands } = new SlashCommandHandler();
    const { loadAntiCrash } = new AntiCrash();
    try {
      switch (args[0]?.toLowerCase()) {
        case "commands":
        case "commandos":
          {
            options = "Commands";

            await loadCommands(client);
          }
          break;

        case "slashcommands":
        case "slash":
          {
            options = "Slash Commands";
            await loadSlashCommands(client);
          }
          break;

        case "events":
        case "eventos":
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
      message.reply({
        embeds: [
          new EmbedBuilder({
            fields: [{ name: ` ✅ ${options} reloaded`, value: "> *Okay!*" }],
          }).setColor("White"),
        ],
      });
    } catch (error) {
      message.reply({
        content: `**An error occurred while reloading the files!**\nSee the console for more details`,
      });
      console.log(error);
    }
  },
});
