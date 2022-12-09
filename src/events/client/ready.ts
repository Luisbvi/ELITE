import { ActivityType, version } from "discord.js";

import { Event } from "../../structures/classes/Event";

export default new Event("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`.green);
});
