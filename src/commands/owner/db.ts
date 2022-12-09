import { TicketModel } from "../../schema/Tickets";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "db",
  owner: true,
  async run({ message }) {
    const tickets = await TicketModel.find();
    console.log(tickets);
  },
});
