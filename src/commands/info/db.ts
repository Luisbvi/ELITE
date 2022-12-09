
import { TicketModel } from "../../schema/Tickets";
import PrefixCommand from "../../structures/classes/PrefixCommand";

export default new PrefixCommand({
  name: "sdb",
  run({ message, client }) {
    console.log(TicketModel.find());
  },
});
