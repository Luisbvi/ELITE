import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { GuildModel } from "../../schema/guild";
import { SkillModel } from "../../schema/skills";
import SlashCommand from "../../structures/classes/SlashCommand";
import { numberWithCommas, xpTable } from "../../structures/utils/Utils";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("skilling")
    .setDescription("Skill Quote")
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("...")
        .addChoices(
          {
            name: "Agility",
            value: "Agility",
          },
          {
            name: "Combat",
            value: "Combat",
          },
          {
            name: "Construction",
            value: "Construction",
          },
          {
            name: "Cooking",
            value: "Cooking",
          },
          {
            name: "Crafting",
            value: "Crafting",
          },
          {
            name: "Farming",
            value: "Farming",
          },
          {
            name: "Firemaking",
            value: "Firemaking",
          },
          {
            name: "Fishing",
            value: "Fishing",
          },
          {
            name: "Fletching",
            value: "Fletching",
          },
          {
            name: "Herblore",
            value: "Herblore",
          },
          {
            name: "Hunter",
            value: "Hunter",
          },
          {
            name: "Magic",
            value: "Magic",
          },
          {
            name: "Mining",
            value: "Mining",
          },
          {
            name: "Prayer",
            value: "Prayer",
          },
          {
            name: "Ranged",
            value: "Ranged",
          },
          {
            name: "Runecrafting",
            value: "Runecrafting",
          },
          {
            name: "Slayer",
            value: "Slayer",
          },
          {
            name: "Smithing",
            value: "Smithing",
          },
          {
            name: "Thieving",
            value: "Thieving",
          },
          {
            name: "Woodcutting",
            value: "Woodcutting",
          }
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("start")
        .setDescription("...")
        .setMaxValue(98)
        .setMinValue(1)
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("stop")
        .setDescription("...")
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(99)
    ),

  async run({ interaction, args }) {
    await interaction.deferReply({ ephemeral: true });
    const embed = new EmbedBuilder().setColor("Yellow").setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL(),
    });

    const skill = args.getString("skill");
    const start = args.getNumber("start");
    const stop = args.getNumber("stop");
    const customer = interaction.member;

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
      guildId: interaction.guildId,
    });
    const skillData = await SkillModel.findOne({ name: skill });

    if (!skillData)
      return interaction.editReply({
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

    interaction.editReply({
      embeds: [embed],
    });
  },
});
