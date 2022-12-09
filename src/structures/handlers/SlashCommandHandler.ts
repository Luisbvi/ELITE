import { ApplicationCommandDataResolvable, REST, Routes } from "discord.js";

import { ExtendedClient } from "../classes/Client";
import { SlashCommandType } from "../interfaces/SlashCommand";
import { importFiles, loadFiles } from "../utils/Utils";

export class SlashCommandHandler {
  public async loadSlashCommands(client: ExtendedClient) {
    console.log(`(/) Loading SlashCommands`.yellow);
    await client.slashCommand.clear();
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const filePath = await loadFiles("/src/slashCommands");

    if (filePath.length) {
      await Promise.all(
        filePath.map(async (commandPath) => {
          try {
            const slashCommand: SlashCommandType = await importFiles(
              commandPath
            );

            if (!slashCommand.name) return;

            client.slashCommand.set(slashCommand.name, slashCommand);
            slashCommands.push(slashCommand);
            client.application?.commands.set(slashCommands);
          } catch (error) {
            console.log(`ERROR LOADING FILE ${commandPath}`.bgRed);
            console.log(error);
          }
        })
      );
    }

    const rest = new REST({ version: "10" }).setToken(process.env.botToken);
    await (async () => {
      try {
        const data = rest.put(
          Routes.applicationGuildCommands(
            process.env.clientId,
            process.env.guildId
          ),
          { body: slashCommands }
        );

        console.log(
          `(/) ${client.slashCommand.size} SlashCommand`.green +
            (client.slashCommand.size > 1 ? "s".green : "") +
            ` loaded`.green
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }
}
