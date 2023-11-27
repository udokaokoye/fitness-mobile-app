// redux/reducers/counterSlice.js

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserMealsProp, UsersCaloriesProp, logMealProps } from '../../utils/types';

const initialState: UserMealsProp = {
    breakfast: {
        calories: 0,
        macros: {
            protien: 0,
            carbohydrate: 0,
            fat:0
        }
    },
    lunch: {
        calories: 0,
        macros: {
            protien: 0,
            carbohydrate: 0,
            fat:0
        }
    }, 
    dinner: {
        calories: 0,
        macros: {
            protien: 0,
            carbohydrate: 0,
            fat:0
        }
    }   
    
}

const mealsSlice = createSlice({
  name: 'meals',
  initialState: initialState,
  reducers: {
    logBreakfast: (state, action:PayloadAction<logMealProps>) => {
        let updatedState = state;
        updatedState.breakfast.calories = action.payload.caloriesIN;
        updatedState.breakfast.macros = {
            carbohydrate: action.payload.carbohydrate,
            fat: action.payload.fat,
            protien: action.payload.protien
        }

        return updatedState;
    },

    logLunch: (state, action:PayloadAction<logMealProps>) => {
        let updatedState = state;
        updatedState.lunch.calories = action.payload.caloriesIN;
        updatedState.lunch.macros = {
            carbohydrate: action.payload.carbohydrate,
            fat: action.payload.fat,
            protien: action.payload.protien
        }

        return updatedState;
    },

    logDinner: (state, action:PayloadAction<logMealProps>) => {
        let updatedState = state;
        updatedState.dinner.calories = action.payload.caloriesIN;
        updatedState.dinner.macros = {
            carbohydrate: action.payload.carbohydrate,
            fat: action.payload.fat,
            protien: action.payload.protien
        }

        return updatedState;
    }
    
  },
});

export const { logBreakfast, logLunch, logDinner } = mealsSlice.actions;
export default mealsSlice.reducer;
