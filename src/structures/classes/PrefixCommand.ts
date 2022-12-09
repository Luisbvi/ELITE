import { PrefixCommandType } from "../interfaces/Command";

export default class PrefixCommand {
  constructor(commandType: PrefixCommandType) {
    Object.assign(this, commandType)
  }
}
