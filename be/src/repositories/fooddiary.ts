import prisma from "../client";

import { FoodDiary, FoodDiaryWithUser } from "../types/fooddiary";
import { IdModel, OmitId } from "shared/types";

const foodDiarySelect = {
    id: true,
    name: true,
    grams: true,
    dateEaten: true,
  }
  

export const getAll = async (data: IdModel): Promise<FoodDiary[]> => {
    return await prisma.foodDiary.findMany({
      where: {
        userId: data.id,
      },
      select: foodDiarySelect
    });
}

// export const getSingle = async (data: IdModel): Promise<FoodDiary | null> => {
//     return await prisma.foodDiary.findUnique({ where: data, select: foodDiarySelect });
// }

export type FoodDiaryCreate = OmitId<FoodDiaryWithUser>;

export const createSingle = async (data: FoodDiaryCreate): Promise<FoodDiary> => {
    return await prisma.foodDiary.create({
        data: data,
        select: foodDiarySelect,
    })

  }