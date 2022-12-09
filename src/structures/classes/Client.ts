import {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  PresenceUpdateStatus,
} from "discord.js";
import { connect } from "mongoose";
import { AntiCrash } from "../handlers/antiCrash";
import { CommandsHandler } from "../handlers/CommandsHandler";
import { EventsHandler } from "../handlers/EventsHandler";
import { SlashCommandHandler } from "../handlers/SlashCommandHandler";
import { PrefixCommandType } from "../interfaces/Command";
import { SlashCommandType } from "../interfaces/SlashCommand";
const { Guilds, GuildMembers, GuildMessages, MessageContent } =
  GatewayIntentBits;
const { User, Channel, GuildMember, Message, Reaction } = Partials;

export class ExtendedClient extends Client {
  commands: Collection<string, PrefixCommandType>;
  slashCommand: Collection<string, SlashCommandType>;

  constructor() {
    super({
      intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
      partials: [User, Channel, GuildMember, Message, Reaction],
      allowedMentions: { parse: ["users", "roles"], repliedUser: false },
      presence: {
        activities: [
          {
            name: process.env.status,
            type: ActivityType[process.env.statusType],
          },
        ],
        status: PresenceUpdateStatus.Online,
      },
    });

    this.commands = new Collection();
    this.slashCommand = new Collection();
  }

  public async start() {
    // Modules
    await this.registerModules();

    // DB

    await this.connectToDB()

    // Login
    await this.login(process.env.botToken);
  }

  private async connectToDB() {
    connect(process.env.mongo_uri)
      .then(() => {
        console.log(`Connected to database.`.green);
      })
      .catch((e) => {
        console.log(`Error connecting to database.\n${e}`);
      });
  }

  private async registerModules() {
    const { loadEvents } = new EventsHandler();
    const { loadCommands } = new CommandsHandler();
    const { loadSlashCommands } = new SlashCommandHandler();
    const { loadAntiCrash } = new AntiCrash();

    try {
      await loadEvents(this);
      await loadAntiCrash(this);
      await loadCommands(this);
      await loadSlashCommands(this);
    } catch (error) {
      console.log(error);
    }
  }
}
