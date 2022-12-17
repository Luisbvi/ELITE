import { model, Schema } from "mongoose";

interface IQuest {
  quests: [
    {
      name: string;
      price: number;
      alias?: [string];
    }
  ];
  id: string;
}

const QuestSchema = new Schema<IQuest>({
  quests: [
    {
      name: String,
      price: Number,
      alias: [String],
    },
  ],
  id: String,
});

export const QuestModel = model("quest", QuestSchema);
