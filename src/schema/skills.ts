import { model, Schema } from "mongoose";

interface ISkill {
  name: string;
  cape: string;
  color: number;
  icon: string;
  animation: string;
  url: string;
  methods: [
    {
      name: string;
      value: [
        {
          name: string;
          minLvl: number;
          maxLvl: number;
          price: number;
        }
      ];
    }
  ];
}

const SkillSchema = new Schema<ISkill>({
  name: String,
  cape: String,
  color: Number,
  icon: String,
  animation: String,
  url: String,
  methods: [
    {
      name: String,
      value: [
        {
          name: String,
          minLvl: Number,
          maxLvl: Number,
          price: Number,
        },
      ],
    },
  ],
});

export const SkillModel = model<ISkill>("skill", SkillSchema);
