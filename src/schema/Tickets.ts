import { model, Schema } from "mongoose";

export interface ITickets {
  guildId: string;
  memberId: string;
  channelId: string;
  locked: boolean;
  closed: boolean;
  type: string;
  closedMessageId: string;
}

const TicketSchema = new Schema({
  guildId: String,
  memberId: String,
  channelId: String,
  locked: Boolean,
  closed: Boolean,
  type: String,
  closedMessageId: String,
});

export const TicketModel = model<ITickets>("Ticket", TicketSchema);
