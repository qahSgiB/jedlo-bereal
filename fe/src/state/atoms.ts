import { atom } from "recoil";



type FoodDiary = {
  name: string,
  grams: number,
  dateEaten: string,
}



export const startDateState = atom<Date | null>({
  key: 'startDateState',
  default: null,
});

export const endDateState = atom<Date | null>({
  key: 'endDateState',
  default: null,
});
  
export const foodsAtom = atom<FoodDiary[]>({
  key: 'foodsAtomKey',
  default: [],
});

export const overallKcalState = atom({
  key: 'overallKcal',
  default: 0,
});
  
export const overallFatState = atom({
  key: 'overallFat',
  default: 0,
});
  
export  const overallCarbsState = atom({
  key: 'overallCarbs',
  default: 0,
});
  
export  const overallProteinsState = atom({
  key: 'overallProteins',
  default: 0,
});
  
export  const overallGramsState = atom({
  key: 'overallGrams',
  default: 0,
});

export const showDialogState = atom({
  key: 'showDialog',
  default: false,
})