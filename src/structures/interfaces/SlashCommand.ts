import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionsString,
  SlashCommandBuilder,
  SharedNameAndDescription,
} from "discord.js";
import { ExtendedClient } from "../classes/Client";

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFuction = (options: RunOptions) => any;

export type SlashCommandType = {
  data: SlashCommandBuilder | SharedNameAndDescription;
  cooldown?: number;
  owner?: boolean;
  botPermissions?: PermissionsString[];
  run: RunFuction;
};

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}
