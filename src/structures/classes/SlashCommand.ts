import { SlashCommandType } from "../interfaces/SlashCommand";

export default class SlashCommand {
  constructor(commandType: SlashCommandType) {
    Object.assign(this, commandType);
  }
}
