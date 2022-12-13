import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { WorkerModel } from "../../schema/worker";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("setworker")
    .setDescription("Create worker's profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("...").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("deposit")
        .setDescription("...")
        .setRequired(true)
        .addChoices(
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
          }
        )
    )
    .addStringOption((option) =>
      option.setName("tax").setDescription("...").setRequired(true).addChoices(
        {
          name: "30%",
          value: "30",
        },
        {
          name: "25%",
          value: "25",
        },
        {
          name: "20%",
          value: "20",
        },
        {
          name: "15%",
          value: "15",
        }
      )
    )
    .addIntegerOption((option) =>
      option
        .setName("max_jobs")
        .setDescription("...")
        .setRequired(true)
        .addChoices(
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
          }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async run({ interaction, args }) {
    await interaction.deferReply({ ephemeral: true });
    const user = args.getUser("user");
    const deposit = args.getString("deposit");
    const tax = args.getInteger("tax");
    const maxJobs = args.getInteger("max_jobs");

    const data = await WorkerModel.findOne({ workerId: user.id });

    if (data) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder({
            description: `:x: ${user} is already registerd in our database`,
          }).setColor("Red"),
        ],
      });
    }

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
  },
});
