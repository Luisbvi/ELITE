import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "rules",
  description: "Rules of the discord server",
  permissions: ["Administrator"],
  run: async ({ message }) => {
    const generalRulesEmbed = new EmbedBuilder({
      description:
        "**📺GENERAL RULES📺**\n*Please follow & Respect all of discords rules & Tos.*\n\n> **1.0 - This is a server for you to buy accounts, gold, services. This is not a price checking discord or a discord for you to sell accounts.\n> \n  > 1.1 - We dont buy accounts either, so all pitches will be ignored.\n> \n   > 1.2 - Sales are not tolerated and advertising will result into a permanent ban.**\n\n\n**📺TERMS OF SERVICES📺**\n\n> **2.0 - You are required to change your password before & after the services being handled.\n> \n   >  2.1 - We require you to remove unnecessary wealth from your account prior to a service starting.\n> \n   >  2.2 - All information in your ticket is completely private to only owner/staff and yourself.\n> \n   > 2.3 - You must post a picture of your account stats when you open a ticket prior to getting a quote.\n> \n   > 2.4 - All pre-quest and skill requirements must be done or you will be charged for the quests/skills needed to complete your job.\n> \n   > 2.5 - All items for the quest must be purchased, or gp must be left on the account so that we can purchase the items needed from the GE.\n> \n   > 2.6 - We have the right to decline & refund any order at any point.\n> \n   > 2.7 - We are not responsible for any bans or mutes during or after the service is completed everything. All work is carried out by hand.\n> \n   > 2.8 - Ironman accounts may add additional fees if items and reqs needed for your job to be completed.\n> \n   > 2.9 - We are not held liable for Hcim deaths, & defence levels gained speak/talk with a staff member to try discuss an option if damanaged is caused.\n> \n   > 2.10 - Please do try not log in while a service is being done, unless you've spoke with the worker/staff. This prevents account flagging.\n> \n   > 2.11 - All jobs will be trained via hand with the following clients: Runelite or the standard oldschool client.\n> \n   > 2.12 - Some jobs may take longer then expected, delays happen. We will try compensate, but we are not entitled to.\n> \n   > 2.13 - After your job is finished it is your own responsibility to resecure your account. We will not be responsible for any hacks after the service is done.\n> \n   > 2.14 - For account purchases, you take full responsability in case of RWT Bans or any bans that may occur after you purchase.\n> \n   > 2.15 - All accounts sold are rested and we don't offer any insuranse or refunds for it. Buying accounts is an offense after all and it may sometimes lead to RWT/Macro ban\n> \n   > 2.16 - Refunds will be given at no cost if the job has not started. if you cancel mid service. you will receive a 20% fee, for time & effort for reposting.\n> \n   > 2.17 - When we collect rsgp/btc/pp for a job it will be added to your personal wallet. This amount can be spend on any job within the server. Whenever a refund of this is asked you will recieve a 20% fee.**",
      thumbnail: { url: message.guild?.iconURL() },
      footer: {
        text: "By clicking the button below you will accept our TOS",
        icon_url: message.guild.iconURL(),
      },
    }).setColor("White");

    const row = new ActionRowBuilder<ButtonBuilder>({
      components: [
        new ButtonBuilder({
          customId: "accept-tos",
          label: "Accept",
          style: ButtonStyle.Success,
        }),
      ],
    });

    await message.channel.send({
      embeds: [generalRulesEmbed],

      components: [row],
    });
  },
});
