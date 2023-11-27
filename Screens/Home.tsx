import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HomeHeader from "../Components/HomeHeader";
import { ThemeContext } from "../Store/ThemeContext";
import FoodSearchInput from "../Components/FoodSearchInput";
import MainCarousel from "../Components/MainCarousel";
import { blackTheme } from "../Store/themes";
import ExerciseComponent from "../Components/ExerciseComponent";
import CaloriesHistory from "../Components/CaloriesHistory";
import GoalSummary from "../Components/GoalSummary";
import CaloriesBreakdown from "../Components/CaloriesBreakdown";
import { Icon } from "@rneui/base";
import { getUsersAccessToken } from "../utils/lib";
import CaloriesDisplayCard from "../Components/CaloriesDisplayCard";
import MacrosInfo from "../Components/MacrosInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState, UserMealsProp } from "../utils/types";
import { AuthContext } from "../Store/AuthContext";
import moment from "moment";
import { MealsHistoryContext } from "../Store/MealsHistoryContext";
import { logMeal } from "../redux/reducers/caloriesSlice";
import { logBreakfast, logDinner, logLunch } from "../redux/reducers/mealsSlice";
const Home = ({ navigation }: any) => {
  const ipAddress = "172.16.137.203";
  const user = useContext(AuthContext)?.user;
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const [accessToken, setaccessToken] = useState("");
  const mealsHistoryContext = useContext(MealsHistoryContext)

  const dispatch = useDispatch();

  const setmealHistory = mealsHistoryContext?.setmealHistory
  useEffect(() => {
    // alert("hello")
    fetchMealHistory()
  }, [])

  const fetchMealHistory = async () => {
    // console.log(moment().startOf('day').unix())
    // console.log(moment().endOf('day').unix())
    // console.log(user?.id)
    // return;
    const response = await fetch(`http://${ipAddress}/fitness-backend/api/food/index.php?userId=${user?.id}&beginningOfDay=${moment().startOf('day').unix()}&endOfDay=${moment().endOf('day').unix()}`)
    const data = await response.json()

    setmealHistory(data.message)
    let caloriesTotal = 0;
    let proteinTotal = 0;
    let carbsTotal = 0;
    let fatTotal = 0;

    const initialMeals: UserMealsProp = {
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


    data.message.map((foodData: any) => {

      if (foodData.meal == "B") {
        initialMeals.breakfast.calories += parseInt(foodData.calories);
        initialMeals.breakfast.macros.protien += parseInt(foodData.protein);
        initialMeals.breakfast.macros.carbohydrate += parseInt(foodData.carbohydrate);
        initialMeals.breakfast.macros.fat += parseInt(foodData.fat);
      }

      if (foodData.meal == "L") {
        initialMeals.lunch.calories += parseInt(foodData.calories);
        initialMeals.lunch.macros.protien += parseInt(foodData.protein);
        initialMeals.lunch.macros.carbohydrate += parseInt(foodData.carbohydrate);
        initialMeals.lunch.macros.fat += parseInt(foodData.fat);
      }

      if (foodData.meal == "D") {
        initialMeals.dinner.calories += parseInt(foodData.calories);
        initialMeals.dinner.macros.protien += parseInt(foodData.protein);
        initialMeals.dinner.macros.carbohydrate += parseInt(foodData.carbohydrate);
        initialMeals.dinner.macros.fat += parseInt(foodData.fat);
      }

      caloriesTotal += parseInt(foodData.calories);
      proteinTotal += parseInt(foodData.protein);
      carbsTotal += parseInt(foodData.carbohydrate);
      fatTotal += parseInt(foodData.fat);
    })

    dispatch(
      logMeal({
        caloriesIN: caloriesTotal,
        carbohydrate: carbsTotal,
        protien: proteinTotal,
        fat: fatTotal,
      })
    );

    dispatch(logBreakfast({
      caloriesIN:initialMeals.breakfast.calories,
            carbohydrate: initialMeals.breakfast.macros.carbohydrate,
            protien: initialMeals.breakfast.macros.protien,
            fat: initialMeals.breakfast.macros.fat,
    }))

    dispatch(logLunch({
      caloriesIN:initialMeals.lunch.calories,
            carbohydrate: initialMeals.lunch.macros.carbohydrate,
            protien: initialMeals.lunch.macros.protien,
            fat: initialMeals.lunch.macros.fat,
    }))
    dispatch(logDinner({
      caloriesIN:initialMeals.dinner.calories,
            carbohydrate: initialMeals.dinner.macros.carbohydrate,
            protien: initialMeals.dinner.macros.protien,
            fat: initialMeals.dinner.macros.fat,
    }))
  }
  

  const theme = themeContext.theme;

  const caloriesInformation = useSelector((state: RootState) => state.userCalories)
  const mealsInformation = useSelector((state: RootState) => state.userMeals)
  return (
    <SafeAreaView
      style={{ backgroundColor: themeContext.theme.background, flex: 1 }}
    >
      <StatusBar backgroundColor={theme.background} />

      <ScrollView>
        <View className=" flex-1">
          <HomeHeader theme={theme} />
          <FoodSearchInput navigation={navigation} theme={theme} />
          {/* <MainCarousel theme={theme} /> */}
          <CaloriesDisplayCard theme={theme} calories={caloriesInformation} />
          <MacrosInfo theme={theme}  calories={caloriesInformation} />
          {/* <GoalSummary theme={theme} /> */}
          <CaloriesBreakdown navigation={navigation} theme={theme} meals={mealsInformation} />
          <CaloriesHistory navigation={navigation} theme={theme} />

          {/* <ExerciseComponent theme={theme} /> */}
        </View>

        <View className="h-24"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
