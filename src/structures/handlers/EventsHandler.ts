import { glob } from "glob";
import { promisify } from "util";
import { ExtendedClient } from "../classes/Client";
import { importFiles } from "../utils/Utils";
import { Event } from "../classes/Event";
import { ClientEvents } from "discord.js";
const PG = promisify(glob);

export class EventsHandler {
  public async loadEvents(client: ExtendedClient) {
    client.removeAllListeners()
    console.log(`(+) Loading events`.yellow)
    const eventFiles = await PG(`${__dirname}/../../events/*/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await importFiles(filePath);
      client.on(event.name, event.run);
    });
    console.log(
      `(+) ${eventFiles.length} Event`.green +
        (client.slashCommand.size > 1 ? "s".green : "") +
        ` loaded`.green
    );
  }
}
