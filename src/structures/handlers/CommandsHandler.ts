import { ExtendedClient } from "../classes/Client";
import { PrefixCommandType } from "../interfaces/Command";
import { importFiles, loadFiles } from "../utils/Utils";

export class CommandsHandler {
  public async loadCommands(client: ExtendedClient) {
    console.log(`${process.env.prefix} Loading commands`.yellow);
    await client.commands.clear();

    const filePath = await loadFiles("/src/commands");
    if (filePath.length) {
      await Promise.all(
        filePath.map(async (path) => {
          try {
            const command: PrefixCommandType = await importFiles(path);
            if (command.name) client.commands.set(command.name, command);
          } catch (error) {
            console.log(`ERROR LOADING FILE ${path}`.bgRed);
            console.log(error);
          }
        })
      );
    }
    console.log(
      `${process.env.prefix} ${client.commands.size} Command`.green +
        (client.commands.size > 1 ? "s".green : "") +
        ` loaded`.green
    );
  }
}
