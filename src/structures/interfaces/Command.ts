import { Message, PermissionsString } from "discord.js";
import { ExtendedClient } from "../classes/Client";
import { ExtendedInteraction } from "./SlashCommand";

interface CommandArgs {
  name: string;
  type:
    | "user"
    | "role"
    | "channel"
    | "string"
    | "number"
    | "boolean"
    | string
    | number
    | boolean;
  required?: boolean;
}

export interface PrefixCommandType {
  name: string;
  description?: string;
  aliases?: Array<string>;
  permissions?: PermissionsString[];
  owner?: boolean;
  botPermissions?: PermissionsString[];
  cooldown?: number;
  isPremium?: boolean;
  isDevCommand?: boolean;
  options?: Array<CommandArgs>;
  run: (options: RunOptions) => any;
}

type RunOptions = {
  client: ExtendedClient;
  message: Message;
  args: string[];
};
