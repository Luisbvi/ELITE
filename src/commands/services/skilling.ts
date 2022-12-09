import { EmbedBuilder } from "discord.js";
import { GuildModel } from "../../schema/guild";
import { SkillModel } from "../../schema/skills";
import PrefixCommand from "../../structures/classes/PrefixCommand";
import { xpTable, numberWithCommas } from "../../structures/utils/Utils";

export default new PrefixCommand({
  name: "s",
  async run({ args, message }) {
    const sskill = args[0];
    const numbers = message.content.match(/\d+/g);
    let start = parseInt(numbers[0]);
    let stop = parseInt(numbers[1]);
    const preSkill = parseInt(sskill);

    if (!isNaN(preSkill) || isNaN(start) || isNaN(stop))
      return message.reply({
        embeds: [
          new EmbedBuilder({
            description:
              ":x: **Invalid format**\nUse: `!skill <skillname> <from> <to>`\nEg: `!skill agility 1-70` ",
          }).setColor("White"),
        ],
      });

    const skill = sskill.replace(
      sskill.charAt(0),
      sskill.charAt(0).toUpperCase()
    );

    if (stop <= start || start < 1) start = 1;
    if (stop > 99) stop = 99;

    const embed = new EmbedBuilder().setColor("Yellow").setFooter({
      text: message.guild.name,
      iconURL: message.guild.iconURL(),
    });
    const customer = message.member;

    const discountRoles = {
      "856961746896289793": 2,
      "929958088780447754": 4,
      "929958488849932318": 6,
      "856961852180004904": 8,
      "856962053640945705": 10,
      "856962276526915605": 12,
    };
    const discountRol = customer.roles.cache.find(
      (rol) => discountRoles[rol.id]
    )?.id;
    const discount: number = discountRoles[discountRol];
    const guildData = await GuildModel.findOne({
      guildId: message.guildId,
    });
    const skillData = await SkillModel.findOne({ name: skill });

    if (!skillData)
      return message.reply({
        embeds: [
          embed
            .setDescription(
              `Skill \`${skill}\` not foud in database. The quote has been cancelled`
            )
            .setColor("Red"),
        ],
      });

    embed
      .setAuthor({
        name: `${skillData?.name} Calculator`,
        iconURL: skillData?.icon,
        url: skillData?.url,
      })
      .setDescription(
        `__**Start Level:**__ \`${start}\`\n__**End Level:**__ \`${stop}\`\n__**Discount:**__ \`${
          discount ? `${discount}% has been applied` : "No Discount"
        }\``
      )
      .setThumbnail(skillData?.animation ?? skillData?.cape)
      .setColor(skillData?.color);

    skillData?.methods.forEach((method) => {
      let totalGp: number;
      let gold = 0;
      let total$: number;

      if (
        method.value.filter(
          (value) => stop > value.minLvl && start <= value.maxLvl
        ).length > 0
      ) {
        embed.addFields(
          {
            name: method.name,
            value: method.value
              .map((value) => {
                const from = start >= value.minLvl ? start : value?.minLvl;
                const to = stop < value.maxLvl ? stop : value?.maxLvl;
                const xpRequired = xpTable[to] - xpTable[from];
                const cost =
                  stop > value.minLvl && start <= value.maxLvl
                    ? (xpRequired * value.price) / 1000000
                    : 0;
                totalGp = gold += cost;
                total$ = gold * guildData["07rate"];

                return stop > value.minLvl && start <= value.maxLvl
                  ? `<:Skills:995431400339685516> **${from}-${to}** - *${
                      value.name
                    }*\n📊 \`${numberWithCommas(
                      xpRequired.toFixed(0)
                    )}\` <:coins_icon:853392355067035709> \`${cost.toFixed(
                      3
                    )}M\``
                  : null;
              })
              .join("\n"),
          },
          {
            name: `<:coins_icon:853392355067035709> ${
              discount
                ? (totalGp - (totalGp * discount) / 100).toFixed(3)
                : totalGp.toFixed(3)
            }M`,
            value: "\u200B",
            inline: true,
          },
          {
            name: `<:BTC:853398763392466944> ${
              discount
                ? (total$ - (total$ * discount) / 100).toFixed(2)
                : total$.toFixed(2)
            }$`,
            value: "\u200B",
            inline: true,
          }
        );
      }
    });

    message.channel.send({
      embeds: [embed],
    });
  },
});
