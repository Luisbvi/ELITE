import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  ChatInputApplicationCommandData,
  GuildMember,
  PermissionsString,
} from "discord.js";
import { ExtendedClient } from "../classes/Client";

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFuction = (options: RunOptions) => any;

export type SlashCommandType = {
  cooldown?: number;
  owner?: boolean;
  permission?: PermissionsString[];
  botPermissions?: PermissionsString[];
  run: RunFuction;
} & ChatInputApplicationCommandData;

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}
