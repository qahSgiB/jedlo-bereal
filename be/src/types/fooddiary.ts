import { IdModel, OmitId } from "shared/types";



export type FoodDiary = IdModel & {
  name: string,
  grams: number,
  dateEaten: string,
}

export type FoodDiaryWithUser = IdModel & {
  name: string,
  grams: number,
  dateEaten: string,
  userId: number,
}

export type FoodDiaryCreate = OmitId<FoodDiaryWithUser>;
