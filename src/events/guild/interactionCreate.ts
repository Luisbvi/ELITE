import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  CommandInteractionOptionResolver,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { client } from "../..";
import { TicketModel } from "../../schema/Tickets";
import { Event } from "../../structures/classes/Event";
import { ExtendedInteraction } from "../../structures/interfaces/SlashCommand";
import { createTranscript } from "discord-html-transcripts";
import { WorkerModel } from "../../schema/worker";
import { jobModel } from "../../schema/job";
import { GuildModel } from "../../schema/guild";
import { connection } from "mongoose";

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slashCommand.get(interaction?.commandName);
    if (command) {
      if (command.owner) {
        const owners = process.env.owners.split(" ");
        if (!owners.includes(interaction.user.id))
          return interaction.reply({
            content: `:x:**Only the owners can execute this command**\nOwners: ${owners
              .map((owner) => `<@${owner}>`)
              .join(", ")}`,
          });
      }

      if (command.botPermissions) {
        if (
          !interaction.guild.members.me.permissions.has(command.botPermissions)
        )
          return interaction.reply({
            content: `:x: **I need the following persmissions to execute this command**\n${command.botPermissions
              .map((permission) => `\`${permission}\``)
              .join(", ")}`,
          });
      }
    }

    try {
      command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      });
    } catch (error) {
      interaction.reply({
        content: `Error while running this command please check the console`,
      });
      console.log(error);
      return;
    }
  }

  if (interaction.isButton()) {
    const buttonId = interaction.customId;
    const buttons = {
      "accept-tos": async () => {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const memberRoleID = "929418892894425201";

        if (!member.roles.cache.has(memberRoleID)) {
          await member.roles.add(memberRoleID);
          interaction.reply({
            content: "You accepted our Rules & TOS, enjoy the server!",
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: ":x: **You already accepted our Rules & TOS**",
            ephemeral: true,
          });
        }
      },

      "become-a-worker": async () => {
        await interaction.deferReply({ ephemeral: true });
        interaction.editReply({ content: "Creating Ticket, Please Wait..." });
        await interaction.guild.channels
          .create({
            name: `aplication-${interaction.member.user.username}`,
            type: ChannelType.GuildText,
            parent: process.env.ticketParent,
            permissionOverwrites: [
              {
                id: interaction.member.user.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
              {
                id: interaction.guild.roles.everyone.id,
                deny: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
            ],
          })
          .then(async (channel) => {
            TicketModel.create({
              channelId: channel.id,
              closed: false,
              guildId: interaction.guildId,
              locked: false,
              memberId: interaction.member.user.id,
              type: "Application",
            });

            const embed = new EmbedBuilder({
              title:
                "Bienvenido a tu aplicaci??n para ser worker en nuestro servidor.",
              description:
                "Toma en cuenta que deber??s dejar foto legible de tu **c??dula**, **selfie con tu c??dula** y un **dep??sito** para mantener a nuestros clientes lo m??s seguros posible. Los tipos de contrato disponibles para worker son:\n\n**???<@&1045983445605683240>**\n**Requerimientos:** Sin dep??sito, foto legible de tu c??dula, selfie legible sosteniendo tu c??dula.\n*30% tax/job*, 2 jobs max\n*No tiene permitido cuentas con mucho banco ni cuentas de construcci??n de combat espec??ficas (pure, skiller)*.\n\n???<@&1045984091218128916>\n**Requerimientos: 100M** de dep??sito, foto legible de tu **c??dula, selfie legible.**\n*25% tax/job*,4 jobs max.\n\n???<@&1045984257002188871> \n**Requerimientos: 300M** de dep??sito,**foto legible de tu c??dula, selfie legible**.\n*20% tax/job*, 5 jobs max.\n\n???<@&1045984476863401994>\n**Requerimientos: 500M** de dep??sito, **foto legible de tu c??dula, selfie legible**.\n*15% tax/job*, +5 jobs\n\n*NOTA: El dep??sito es 100% reembolsable cuando decidas dejar el servidor, se te entrega el pr??ximo lunes luego de solicitarlo. No debes tener trabajos activos.\n\nPor favor contesta las siguientes preguntas y los staffs revisar??n tu aplicaci??n lo m??s pronto posible. Basaremos nuestra decisi??n de aprobar/rechazar tu aplicaci??n en votos a favor/en contra.\n\nRequerimos que tengas una cuenta en sythe.org si a??n no la tienes.\n\n**-Link de tu cuenta sythe.org\n\n-??Haces alguna otra actividad diaria en la vida real?\n\n-??Cu??ntas horas al d??a juegas?\n\n-??Cu??ntos d??as a la semana juegas?\n\n-??Cosas que eres capaz de hacer? Ej: Minigames, skilling, quests.\n\n-??Por qu?? deber??amos contratarte?\n\n-Hablamos un poco de ti.\n\n-Si yo fuera tu supervisor y te pido hacer algo con lo que estas en desacuerdo, ??Qu?? har??as?\n\n-??Qu?? te atrajo a este servidor?\n\n-??Cu??les son tus debilidades como empleado?\n\n-??Qu?? cosas puedes hacer por nosotros que otros candidatos no pueden?\n\n-??Qu?? tipo de metas tienes en mente si obtienes este trabajo?\n\n-??Para qu?? eres bueno en el juego y qu?? es lo que m??s disfrutas?**",
            }).setColor("White");

            const Buttons = new ActionRowBuilder<ButtonBuilder>({
              components: [
                {
                  customId: "close",
                  label: "Close",
                  style: ButtonStyle.Secondary,
                  emoji: "????",
                  type: ComponentType.Button,
                },
              ],
            });

            channel.send({
              content: `${interaction.member}`,
              embeds: [embed],
              components: [Buttons],
            });

            interaction.editReply({
              content: `Ticket created ${channel}`,
            });
          });
      },

      close: async () => {
        const ticket = await TicketModel.findOne({
          channelId: interaction.channelId,
        });
        if (!ticket) {
          return interaction.reply({
            content:
              "No data was found related to this ticket, please delete manually.",
            ephemeral: true,
          });
        }

        if (ticket.closed) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder({
                description: "This ticket is already closed",
              }).setColor("White"),
            ],
            ephemeral: true,
          });
        }

        if (interaction.channelId === ticket.channelId) {
          interaction.update({});
          interaction.channel.send({
            content: "Are you sure you would like to close this ticket?",
            components: [
              new ActionRowBuilder<ButtonBuilder>({
                components: [
                  {
                    customId: "confirm-close",
                    label: "Close",
                    style: ButtonStyle.Danger,
                    type: ComponentType.Button,
                  },
                  {
                    customId: "cancel-close",
                    label: "Cancel",
                    style: ButtonStyle.Secondary,
                    type: ComponentType.Button,
                  },
                ],
              }),
            ],
          });
        }
      },

      "confirm-close": async () => {
        const ticket = await TicketModel.findOne({
          channelId: interaction.channelId,
        });

        const closedEmbed = new EmbedBuilder({
          description: `Ticket closed by ${interaction.member}`,
        }).setColor("White");

        const channel = interaction.guild.channels.cache.get(
          ticket.channelId
        ) as TextChannel;

        interaction.message.delete();

        await interaction.channel.send({ embeds: [closedEmbed] });

        channel.edit({
          permissionOverwrites: [
            {
              id: ticket.memberId,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        });

        await TicketModel.updateOne(
          { channelId: channel.id },
          { closed: true }
        );

        interaction.channel.send({
          embeds: [
            new EmbedBuilder({
              description: "`Support team ticket controls`",
            }).setColor("#36393F"),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>({
              components: [
                {
                  customId: "transcript",
                  label: "Transcript",
                  emoji: "????",
                  style: ButtonStyle.Secondary,
                  type: ComponentType.Button,
                },
                {
                  customId: "delete",
                  label: "Delete",
                  emoji: "???",
                  style: ButtonStyle.Secondary,
                  type: ComponentType.Button,
                },
              ],
            }),
          ],
        });
      },

      "cancel-close": async () => {
        await interaction.update({});
        interaction.message.delete();
      },

      ping: async () => {
        await interaction.reply({
          content: "Fetching data...",
          ephemeral: true,
        });
        const status = [
          "Disconnected",
          "Connected",
          "Connecting",
          "Disconnecting",
        ];
        await interaction.client.user.fetch();
        await interaction.client.application.fetch();
        const embed = new EmbedBuilder({
          title: `${interaction.client.user.username}'s status`,
          thumbnail: {
            url: interaction.client.user.displayAvatarURL({ size: 1024 }),
          },
          fields: [
            {
              name: "System",
              value: [
                `??? **Up Since** <t:${parseInt(
                  (interaction.client.readyTimestamp / 1000).toFixed(0)
                )}:R>`,
                `???? **Ping** ${interaction.client.ws.ping}ms`,
                `???? **Database** ${status[connection.readyState]}`,
              ].join("\n"),
              inline: true,
            },
          ],
        }).setColor(interaction.guild.members.me.roles.highest.hexColor);
        interaction.editReply({ content: "", embeds: [embed] });
      },

      delete: async () => {
        interaction.update({});

        interaction.channel.send({
          embeds: [
            new EmbedBuilder({
              description: "Ticket will be deleted in few seconds",
            }).setColor("White"),
          ],
        });

        setTimeout(() => {
          interaction.channel.delete();
          TicketModel.deleteOne({ channelId: interaction.channelId });
        }, 10000);
      },

      transcript: async () => {
        const ticket = await TicketModel.findOne({
          channelId: interaction.channelId,
        });
        interaction.update({});
        const msg = await interaction.channel.send({
          embeds: [
            new EmbedBuilder({
              description: "Transcript saving...",
            }).setColor("White"),
          ],
        });

        const transcript = await createTranscript(interaction.channel, {
          filename: `transcript-${interaction.channel.name}.html`,
          limit: -1,
        });

        const member = interaction.guild.members.cache.get(ticket.memberId);

        const transcriptChannel = interaction.guild.channels.cache.get(
          process.env.transcriptChannel
        ) as TextChannel;

        const transcriptEmbed = new EmbedBuilder({
          author: {
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({ forceStatic: false }),
          },
          fields: [
            {
              name: "Ticket Owner",
              value: `${member}`,
              inline: true,
            },
            {
              name: "Ticket Name",
              value: interaction.channel.name,
              inline: true,
            },
            {
              name: "Guild Name",
              value: interaction.guild.name,
              inline: true,
            },
          ],
        }).setColor("White");

        await interaction.channel.send({
          files: [transcript],
          embeds: [transcriptEmbed],
        });

        msg.edit({
          embeds: [
            new EmbedBuilder({
              description: `Transcript saved to ${interaction.channel}`,
            }).setColor("White"),
          ],
        });

        member.send({ files: [transcript], embeds: [transcriptEmbed] });
        transcriptChannel.send({
          embeds: [transcriptEmbed],
          files: [transcript],
        });
      },

      claim: async () => {
        const worker = interaction.member as GuildMember;
        const tierId = interaction.message.embeds[0].fields
          .find((field) => field.name === "Tier Requerido")
          .value.replace(/[<@&>]/g, "");
        const orderNumber = interaction.message.embeds[0].footer.text;

        const tierRequired = interaction.guild.roles.cache.get(tierId);
        const workerTier = worker?.roles.cache.find((rol) =>
          rol.name.startsWith("Tier")
        );

        if (
          workerTier?.comparePositionTo(tierRequired) < 0 ??
          !worker.roles.highest.permissions.has("Administrator")
        ) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            embeds: [
              new EmbedBuilder({
                description: `No posees el Tier requerido para tomar este trabajo (${tierRequired}). Aumenta tu dep??sito para aumentar tu Tier (${workerTier}), habla con un <@&1048822484062982256> para eso.`,
              }).setColor("#36393F"),
            ],
          });
        }

        const workerData = await WorkerModel.findOne({ workerId: worker.id });
        const jobData = await jobModel.findOne({ orderNumber: orderNumber });

        if (!workerData) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            embeds: [
              new EmbedBuilder({
                description: `${worker} no est?? registrado en la base de datos, por favor comunicarse con alg??n staff`,
              }),
            ],
          });
        }

        if (workerData.currentJobsAmount >= workerData.maxJobAmount) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            embeds: [
              new EmbedBuilder({
                description: `Tu n??mero de trabajos permitidos ya ha sido alcanzado, finaliza algunos de tus trabajos actuales o incrementa tu Tier para tener m??s espacio.`,
              }).setColor("#36393F"),
            ],
          });
        }

        const receivedEmbed = interaction.message.embeds[0];
        receivedEmbed.fields.find(
          (field) => field.name === "Tomado por"
        ).value = `${worker.user.username}`;
        const jobEmbed = EmbedBuilder.from(receivedEmbed)
          .setColor("Red")
          .setTitle("Trabajo no disponible");

        receivedEmbed.fields.find((field) => {
          if (field.name === "Pago bruto") {
            field.name = "Pago neto";
            field.value = `${
              parseInt(field.value) -
              (parseInt(field.value) * workerData.tax) / 100
            }$`;
          }
        });

        receivedEmbed.fields.forEach((field) => {
          if (field.name === "Tomado por") {
            field.name = "\u200b";
            field.value = "\u200b";
          }
        });

        const workerEmbed = EmbedBuilder.from(receivedEmbed)
          .setColor("White")
          .setTitle(null)
          .setDescription(
            `User: || ${"x".repeat(
              jobData.user.length
            )} ||\n\nPass: || ${"x".repeat(
              jobData.pass.length
            )} ||\n\nPin: ||${"x".repeat(jobData.bankPin.length)}||`
          );

        const channelName = `jobs-${interaction.member.user.username.toLowerCase()}`;

        let workerChannel = interaction.guild.channels.cache.find(
          (channel) => channel.name === channelName
        ) as TextChannel;

        workerChannel ??= await interaction.guild.channels.create({
          name: `jobs-${interaction.user.username}`,
          parent: process.env.ticketParent,
          permissionOverwrites: [
            {
              id: interaction.member.user.id,
              allow: ["SendMessages", "ViewChannel", "ReadMessageHistory"],
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: ["ViewChannel", "ReadMessageHistory"],
            },
          ],
        });

        workerChannel.send({
          content: `${interaction.member} - <@&1048822484062982256>`,
          embeds: [workerEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>({
              components: [
                {
                  customId: "reveal",
                  label: "Revelar",
                  style: ButtonStyle.Secondary,
                  type: ComponentType.Button,
                },
                {
                  customId: "cancel-claim",
                  label: "Cancelar Job",
                  style: ButtonStyle.Secondary,
                  type: ComponentType.Button,
                },
              ],
            }),
          ],
        });

        interaction.update({
          embeds: [jobEmbed],
          components: [],
        });
      },

      reveal: async () => {
        if (
          !interaction.guild.members.cache
            .get(interaction.user.id)
            .roles.highest.permissions.has("Administrator")
        )
          return interaction.reply({
            content:
              ":x: S??lo los Administradores pueden revelar la informacion",
            ephemeral: true,
          });
        const receivedEmbed = interaction.message.embeds[0];
        const jobData = await jobModel.findOne({
          orderNumber: receivedEmbed.footer.text,
        });

        const embed = EmbedBuilder.from(receivedEmbed).setDescription(
          `User: || ${jobData.user} ||\n\nPass: || ${jobData.pass} ||\n\nPin: ||${jobData.bankPin}||`
        );

        interaction.update({
          embeds: [embed],
          components: [
            new ActionRowBuilder<ButtonBuilder>({
              components: [
                {
                  customId: "cancel-claim",
                  label: "Cancelar Job",
                  style: ButtonStyle.Secondary,
                  type: ComponentType.Button,
                },
              ],
            }),
          ],
        });
      },
    };

    buttons[buttonId]
      ? buttons[buttonId]()
      : interaction.reply({
          content: ":x: This button isn't implemented yet!",
          ephemeral: true,
        });
  }

  if (interaction.isStringSelectMenu()) {
    const guildData = await GuildModel.findOne({
      id: interaction.guildId,
    });
    const menuId = interaction.customId;
    const menus = {
      services: async () => {
        await interaction.deferReply({ ephemeral: true });
        interaction.editReply({ content: "Creating ticket..." });

        await interaction.guild.channels
          .create({
            name: `${interaction.user.username}-${guildData.orderNumbers}`,
            permissionOverwrites: [
              {
                id: interaction.user.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
              {
                id: interaction.guild.roles.everyone.id,
                deny: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
            ],
            parent: "931321786472210442",
          })
          .then(async (channel) => {
           await  TicketModel.create({
              channelId: channel.id,
              guildId: interaction.guild.id,
              memberId: interaction.user.id,
              closed: false,
              locked: false,
              type: interaction.customId,
            });
            const orderNumber = (parseInt(guildData.orderNumbers) + 1)
              .toString()
              .padStart(4, "0");
            const embed = new EmbedBuilder()
              .setDescription(
                `**Ticket for: ${interaction.values[0]}**\n\nSupport will assist you shortly. In the meantime, please check out our main website https://bottinghub.com/`
              )
              .setFooter({
                text: `${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL(),
              })
              .setColor("White");

            const Buttons = new ActionRowBuilder<ButtonBuilder>({
              components: [
                {
                  customId: "close",
                  label: "Close",
                  style: ButtonStyle.Secondary,
                  emoji: "????",
                  type: ComponentType.Button,
                },
              ],
            });
            channel.send({
              content: `${interaction.member} - <@&1048822484062982256>`,
              embeds: [embed],
              components: [Buttons],
            });

            await GuildModel.updateOne(
              { guildId: interaction.guildId },
              { orderNumbers: orderNumber }
            );

            return interaction.editReply({
              content: `${interaction.member} your ticket has been created: ${channel}`,
            });
          });
      },
    };

    menus[menuId]
      ? menus[menuId]()
      : interaction.reply({
          content: "This select menu isn't available yet",
          ephemeral: true,
        });
  }
});
