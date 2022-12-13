import { model, Schema } from "mongoose";

interface IQuest {
  quests: [
    {
      name: string;
      price: number;
    }
  ];
  id: string;
}

const QuestSchema = new Schema<IQuest>({
  quests: [
    {
      name: String,
      price: Number,
    },
  ],
  id: String,
});

export const QuestModel = model("quest", QuestSchema);
