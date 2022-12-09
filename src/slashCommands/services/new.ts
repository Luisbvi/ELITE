import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { CustomerModel } from "../../schema/customer";
import { jobModel } from "../../schema/job";
import SlashCommand from "../../structures/classes/SlashCommand";
import { GuildModel } from "../../schema/guild";
import guild from "../owner/guild";

export default new SlashCommand({
  name: "new",
  description: "Create new job",
  defaultMemberPermissions: "Administrator",
  options: [
    {
      name: "customer",
      description: "...",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "details",
      description: "...",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "price",
      description: "...",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
    {
      name: "account",
      description: "...",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Regular",
          value: "regular",
        },
        {
          name: "Ironman",
          value: "ironman",
        },
        {
          name: "Hardcore",
          value: "hardcore",
        },
        {
          name: "Pure",
          value: "pure",
        },
      ],
    },
    {
      name: "tier",
      description: "...",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },

    {
      name: "eta",
      description: "Estimate Time Arrive in HOURS",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "warranty",
      description: "...",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Yes",
          value: "yes",
        },
        {
          name: "No",
          value: "no",
        },
      ],
      required: true,
    },
    {
      name: "user",
      description: "...",
      type: ApplicationCommandOptionType.String,
      required: true,
      min_length: 1,
    },
    {
      name: "pass",
      description: "...",
      type: ApplicationCommandOptionType.String,
      min_length: 1,
      required: true,
    },
    {
      name: "bankpin",
      description: "...",
      type: ApplicationCommandOptionType.String,
      min_length: 4,
      max_length: 4,
      required: false,
    },
    {
      name: "stats",
      description: "url of the stats",
      type: ApplicationCommandOptionType.Attachment,
      required: false,
    },
  ],

  async run({ interaction, args }) {
    await interaction.deferReply({ ephemeral: true });
    const embed = new EmbedBuilder({}).setColor("#36393F");
    interaction.editReply({
      embeds: [embed.setDescription("Creating new order, please wait...")],
    });

    const customer = args.getUser("customer");
    const accountType = args.getString("account");
    const details = args.getString("details");
    const price = args.getNumber("price");
    const tier = args.getRole("tier");
    const eta = Math.floor(Date.now() / 1000) + args.getNumber("eta") * 3600;
    const accountStats = args.getString("stats");
    const warranty = args.getString("warranty");
    const user = args.getString("user");
    const pass = args.getString("pass");
    const bankPin = args.getString("bankpin");
    const GuildData = await GuildModel.findOne({
      guildId: interaction.guildId,
    });

    if (!GuildData)
      return interaction.editReply({
        content: null,
        embeds: [embed.setDescription(":x: | Guild Data not found")],
      });

    const orderNumber = (parseInt(GuildData.orderNumbers) + 1)
      .toString()
      .padStart(4, "0");

    await jobModel.create({
      orderNumber,
      customerId: customer.id,
      workerId: null,
      user,
      pass,
      bankPin: bankPin ?? "Ningúno",
    });

    const jobChannel = interaction.guild.channels.cache.get(
      process.env.jobChannel
    ) as TextChannel;

    if (!jobChannel)
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `Invalid jobChannelId provide\n\`${process.env.jobChannel}\``
          ),
        ],
      });

    const jobEmbed = new EmbedBuilder({
      title: "Trabajo disponible",
      description: `Los detalles y el Tier requerido serán los siguientes\n\n**Detalles**\n${details}`,
      fields: [
        { name: "\u200B", value: "\u200B" },
        {
          name: "Tier Requerido",
          value: `${tier}`,
          inline: true,
        },
        {
          name: "Garantía",
          value: warranty === "yes" ? "Si" : "No",
          inline: true,
        },

        {
          name: "Tomado por",
          value: "*Nadie*",
          inline: true,
        },
        {
          name: "Tipo de cuenta",
          value: accountType,
          inline: true,
        },
        {
          name: "Pago bruto",
          value: `${price}$`,
          inline: true,
        },
        {
          name: "Tiempo de entrega",
          value: eta > 0 ? `<t:${eta}:R>` : "Sin Tiempo de entrega",
          inline: true,
        },
      ],
      image: {
        url: accountStats ?? null,
      },
      footer: {
        text: orderNumber,
        icon_url: interaction.guild.iconURL(),
      },
    }).setColor("Yellow");

    const orderEmbed = new EmbedBuilder({
      title: `Order #${orderNumber} created`,
      description: `Thanks you for place an order with us ${customer}\nPlease wait until a worker is assigned to your order`,
      fields: [
        {
          name: "Details",
          value: `${details}`,
          inline: true,
        },
        {
          name: "Warranty",
          value: warranty,
          inline: true,
        },
        {
          name: "Worker assigned",
          value: "*Waiting to be assigned...*",
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Account Type",
          value: accountType,
          inline: true,
        },
        {
          name: "Price",
          value: `${price}$`,
          inline: true,
        },
        {
          name: "ETA",
          value: eta > 0 ? `<t:${eta}:R>` : "No ETA",
          inline: true,
        },
      ],
      thumbnail: { url: customer.displayAvatarURL({ forceStatic: false }) },
    }).setColor("White");

    interaction.channel.send({ embeds: [orderEmbed] });

    jobChannel.send({
      embeds: [jobEmbed],
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            {
              customId: "claim",
              label: "Tomar",
              emoji: "📄",
              style: ButtonStyle.Success,
              type: ComponentType.Button,
            },
          ],
        }),
      ],
    });

    await GuildModel.updateOne(
      { guildId: interaction.guildId },
      { orderNumbers: orderNumber }
    );

    const CustomerData = await CustomerModel.findOne({
      customerId: customer.id,
    });
    CustomerData
      ? await CustomerModel.updateOne(
          { customerId: customer.id },
          { $push: { orderNumbers: orderNumber } }
        )
      : await CustomerModel.create(
          { customerId: customer.id },
          { orderNumbers: orderNumber }
        );

    interaction.editReply({
      embeds: [embed.setDescription("✔ | Order created succesfully")],
    });
  },
});
