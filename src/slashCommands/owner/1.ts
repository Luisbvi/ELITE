import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  data: new SlashCommandBuilder().setName("1").setDescription("..."),
  run({ interaction }) {
  const database = `Alfred Grimhand's Barcrawl  0.80$
  Bear your Soul  0.50$
  Curse of the Empty Lord  0.50$
  Daddy's Home  0.50$
  Enchanted Key  0.50$
  Family Pest  0.50$
  The General's Shadow  0.50$
  In Search of Knowledge  2.00$
  Lair of Tarn Razorlor  1.50$
  Skippy and the Mogres  0.50$`;

  const output = database
  .split("\n")
  .map((quest) => quest.trim().split("  "));

  let arrOb = [{}];

  output.forEach((data) => {
  arrOb.push({ name: data[0], price: parseFloat(data[1]) });
  });

  console.log(arrOb);
  interaction.reply({ content: "passed", ephemeral: true });
  },
});
