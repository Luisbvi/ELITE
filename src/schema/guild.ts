import { model, Schema } from "mongoose";

interface IGuild {
  guildId: string;
  orderNumbers: string;
  "07rate": number;
}

const GuildSchema = new Schema<IGuild>({
  guildId: String,
  orderNumbers: {
    type: String,
    default: "0",
  },
  "07rate": {
    type: Number,
    default: 0.3,
  },
});

export const GuildModel = model("guild", GuildSchema);
