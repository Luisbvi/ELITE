import { ApplicationCommandDataResolvable } from "discord.js";

export interface IRegisterCommands {
  guildId?: string;
  slashCommands: ApplicationCommandDataResolvable[];
}
