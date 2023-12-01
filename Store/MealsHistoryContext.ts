import React, { createContext } from 'react';
import { Theme } from './themes';

export type MealHistoryContextType = {
    mealHistory: MealHistoryProps | any; // Define your Theme type
    setmealHistory: any;
  };

  export interface MealHistoryProps {
    name: string;
    apiFoodID: string;
    calories: number;
    serving: number;
    protein: number;
    carbs: number;
    fat: number;
    meal: string;
    notes: string;
    created_at: string;
  }

export const MealsHistoryContext = createContext<MealHistoryContextType | null>(null);

