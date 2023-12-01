import { combineReducers } from 'redux';
import caloriesSlice from './caloriesSlice';
import { RootState } from '../../utils/types';
import mealsSlice from './mealsSlice';

const rootReducer = combineReducers<RootState>({
  userCalories: caloriesSlice,
  userMeals: mealsSlice
});

export default rootReducer;