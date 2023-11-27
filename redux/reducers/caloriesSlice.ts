// redux/reducers/counterSlice.js

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UsersCaloriesProp, logMealProps } from "../../utils/types";

// ! Store users calories and macros goals in local storage and pull them from local storage and set them as the initial state

const initialState: UsersCaloriesProp = {
  dailyCaloriesGoal: 2000,
  currentCaloriesConsumption: 0,
  macros: {
    protien: {
      value: 0,
      goal: 50,
    },
    carbohydrate: {
      value: 0,
      goal: 50,
    },
    fat: {
      value: 0,
      goal: 50,
    },
  },
};

const caloriesSlice = createSlice({
  name: "calories",
  initialState: initialState,
  reducers: {
    logMeal: (state, action:PayloadAction<logMealProps>) => {
        const {macros, dailyCaloriesGoal, currentCaloriesConsumption} = state
        const updatedMacros = {
            protien: {
                value: macros.protien.value + action.payload.protien,
                goal: macros.protien.goal,
              },
              carbohydrate: {
                value: macros.carbohydrate.value + action.payload.carbohydrate,
                goal: macros.carbohydrate.goal,
              },
              fat: {
                value: macros.fat.value + action.payload.fat,
                goal: macros.fat.goal,
              },
        }
      const updatedData = {
        dailyCaloriesGoal: dailyCaloriesGoal,
        currentCaloriesConsumption: currentCaloriesConsumption + action.payload.caloriesIN,
        macros: updatedMacros
      };
     return updatedData
    },
  },
});

export const { logMeal } = caloriesSlice.actions;
export default caloriesSlice.reducer;
