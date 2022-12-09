import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { WorkerModel } from "../../schema/worker";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  name: "setworker",
  description: "Create worker's profile",
  permission: ["Administrator"],
  dmPermission: false,
  options: [
    {
      name: "user",
      nameLocalizations: { "es-ES": "usuario" },
      description: "...",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "deposit",
      nameLocalizations: { "es-ES": "deposito" },
      description: "...",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "None", value: "Sin depósito" },
        {
          name: "100M",
          value: "100M",
        },
        {
          name: "300M",
          value: "300M",
        },
        {
          name: "500M",
          value: "500M",
        },
      ],
    },
    {
      name: "tax",
      nameLocalizations: { "es-ES": "comision" },
      description: "...",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        {
          name: "30%",
          value: 30,
        },
        {
          name: "25%",
          value: 25,
        },
        {
          name: "20%",
          value: 20,
        },
        {
          name: "15%",
          value: 15,
        },
      ],
    },
    {
      name: "max_jobs",
      nameLocalizations: { "es-ES": "maximos_trabajos" },
      description: "...",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: [
        {
          name: "2",
          value: 2,
        },
        {
          name: "4",
          value: 4,
        },
        {
          name: "5",
          value: 5,
        },
        {
          name: "Unlimited",
          value: 99,
        },
      ],
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async run({ interaction, args }) {
    await interaction.deferReply({ ephemeral: true });
    const user = args.getUser("user");
    const deposit = args.getString("deposit");
    const tax = args.getInteger("tax");
    const maxJobs = args.getInteger("max_jobs");

    const data = await WorkerModel.findOne({ workerId: user.id });

    if (!data) {
      interaction.editReply({ content: "Registering worker in our database" });
      await WorkerModel.create({
        workerId: user.id,
        deposit,
        tax,
        currentJobsAmount: 0,
        maxJobAmount: maxJobs,
      });
      interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder({
            description: "Worker has been registered succesfully",
          }).setColor("White"),
        ],
      });
    } else {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder({
            description: `:x: ${user} is already registerd in our database`,
          }).setColor("Red"),
        ],
      });
    }
  },
});
