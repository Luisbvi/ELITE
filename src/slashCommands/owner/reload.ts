import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { client } from "../..";
import SlashCommand from "../../structures/classes/SlashCommand";
import { AntiCrash } from "../../structures/handlers/antiCrash";
import { CommandsHandler } from "../../structures/handlers/CommandsHandler";
import { EventsHandler } from "../../structures/handlers/EventsHandler";
import { SlashCommandHandler } from "../../structures/handlers/SlashCommandHandler";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload bot files")
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("...")
        .addChoices(
          {
            name: "Commands",
            value: "commands",
          },
          { name: "Slash Commands", value: "slash" },
          { name: "Events", value: "events" }
        )
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run({ interaction, args }) {
    const module = args.getString("module");
    let options = "Commands and Events";
    const { loadEvents } = new EventsHandler();
    const { loadCommands } = new CommandsHandler();
    const { loadSlashCommands } = new SlashCommandHandler();
    const { loadAntiCrash } = new AntiCrash();
    try {
      switch (module ?? "commands") {
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
