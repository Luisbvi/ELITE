import SlashCommand from "../../structures/classes/SlashCommand";

export default new SlashCommand({
  name: "discounts",
  description: "Show the discount table",
  defaultMemberPermissions: "Administrator",
  run: ({ interaction }) => {},
});
