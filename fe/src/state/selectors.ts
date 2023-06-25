import { selector } from "recoil";
import { foodsAtom, startDateState, endDateState } from "../state/atoms";

// not used for now

export const filteredFoodsSelector = selector({
    key: 'filterFoodsSelector',
    get({ get }) {
      const foods = get(foodsAtom);
      const from = get(startDateState);
      const to = get(endDateState);
  
      const result = foods.filter((food) => { 
        const dateEaten = new Date(Date.parse(food.dateEaten));

        return (
          (from === null || from <= dateEaten) && (to === null || to >= dateEaten)
        );
      });
      return result;
    },
  });


  