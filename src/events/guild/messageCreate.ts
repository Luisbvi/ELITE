import { client } from "../..";
import { config } from "dotenv";
import { Event } from "../../structures/classes/Event";
config()
export default new Event("messageCreate", (message) => {
  if (!message.channel || !message.guild || message.author.bot) return;

  if (!message.content.startsWith(process.env.prefix)) return;
  const args = message.content
    .slice(process.env.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift()?.toLowerCase();

  const command = client.commands.get(cmd);

  if (command) {
    if (command.owner) {
      const owners = process.env.owners.split(" ");

      if (!owners.includes(message.author.id))
        return message.reply({
          content: `:x:**Only the owners can execute this command**\nOwners: ${owners
            .map((owner) => `<@${owner}>`)
            .join(", ")}`,
        });
    }

    if (command.botPermissions) {
      if (!message.guild.members.me.permissions.has(command.botPermissions))
        return message.reply({
          content: `:x: **I need the following persmissions to execute this command**\n${command.botPermissions
            .map((permission) => `\`${permission}\``)
            .join(", ")}`,
        });
    }

    if (command.permissions) {
      if (
        !message.guild.members.cache
          .get(message.author.id)
          .permissions.has(command.permissions)
      )
        return message.reply({
          content: `:x: **You need the following persmissions to execute this command**\n${command.permissions
            .map((permission) => `\`${permission}\``)
            .join(", ")}`,
        });
    }

    try {
      command?.run({ client, message, args: args });
    } catch (error) {
      message.reply({
        content: `Error while running this command please check the console`,
      });
      console.log(error);
      return;
    }
  }
});
