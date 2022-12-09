import { EmbedBuilder } from "discord.js";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "discounts",
  run({ message }) {
    const embed = new EmbedBuilder({
      title: "Discount Roles",
      description:
        "**What are the benefits of a discount role?**\n• Discount roles make you eligible for a deduction on any service *(Excludes **Gold sales** <:coins_icon:853392355067035709> and **Fire capes** <:Firecape:1049512815515410442> )*\n\n• Discount rates do not stack up on each other, nor any other discounts we may offer.\n\n**How to achieve discount roles?**\n• You can do so by ordering services from us!\n\n**Current discount roles:**\n> <@&856961339088044082>\n> **Requirement:**\n> Have vouched us in <#761210120549695499>\n> \n> **Benefits:**\n> • Tutorial Island completion for services from scratch\n\n> <@&856961746896289793>\n> **Requirement:**\n> Have spent ***100$*** on services\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `2%` Discount on services\n\n> <@&929958088780447754>\n> **Requirement:**\n> Have spent ***200$*** on our services\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `4%` Discount on services\n\n> <@&929958488849932318>\n> **Requirement:**\n> Have spent ***350$*** on our services\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `6%` Discout on services\n\n> <@&856961852180004904>\n> **Requirement:**\n>  Have spent ***750$*** on our services\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `8%` Discout on services\n> • Every service comes with Warranty\n\n> <@&856962053640945705>\n> **Requirement:**\n>  Have spent ***1250$*** on our services\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `10%` Discount on services\n> • Every service comes with Warranty\n> • We run with all the supplies for the services *(Bond, Gold, etc)*\n\n> <@&856962276526915605>\n> **Requirement:**\n>  Have spent ***1500$*** on our Services\n> Boost our Discord Server with Nitro\n> \n> **Benefits:**\n> • Account Creation and Tutorial Island completion for services from scratch\n> • `12%` Discount on services\n> • Every service comes with Warranty\n> • We run with all the supplies for the services *(Bond, Gold, etc)*\n> • Refunds without fees",
    }).setColor("White");


    message.channel.send({ embeds: [embed] });
  },
});
