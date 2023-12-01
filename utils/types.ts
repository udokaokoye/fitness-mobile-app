export interface UsersCaloriesProp {
  dailyCaloriesGoal: number;
  currentCaloriesConsumption: number;
  macros: GeneralMacrosWithGoal
}

export interface UserMealsProp {
        breakfast :{
            calories: number,
            macros: GeneralMacros
        }
        lunch :{
            calories: number,
            macros: GeneralMacros
        }
        dinner :{
            calories: number,
            macros: GeneralMacros
        }
}

export interface logMealProps {
    caloriesIN: number,
    protien: number,
    fat: number,
    carbohydrate: number
}

export type GeneralMacros = {
    protien: number,
    carbohydrate: number,
    fat: number
}

export type GeneralMacrosWithGoal = {
    protien: {
        value: number,
        goal: number
    },
    carbohydrate: {
        value: number,
        goal: number
    },
    fat: {
        value: number,
        goal: number
    }
}


export interface RootState  {
    userCalories: UsersCaloriesProp;
    userMeals: UserMealsProp
}