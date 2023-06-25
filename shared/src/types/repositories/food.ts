export type Food = {
  id: number,
  userId: number | null,
  name: string,
  kCal: number,
  fat: number,
  carbs: number,
  protein: number,
  description: string | null,
}

export type FoodsPaginated = {
  foods: Food[],
  nextCursor: number | null,
}