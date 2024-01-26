import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import HomeHeader from "../Components/HomeHeader";
import { ThemeContext } from "../Store/ThemeContext";
import FoodSearchInput from "../Components/FoodSearchInput";
import MainCarousel from "../Components/MainCarousel";
import { blackTheme } from "../Store/themes";
import ExerciseComponent from "../Components/ExerciseComponent";
import CaloriesHistory from "../Components/CaloriesHistory";
import GoalSummary from "../Components/GoalSummary";
import CaloriesBreakdown from "../Components/CaloriesBreakdown";
import { Icon, Tooltip } from "@rneui/base";
import { getUsersAccessToken } from "../utils/lib";
import CaloriesDisplayCard from "../Components/CaloriesDisplayCard";
import MacrosInfo from "../Components/MacrosInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState, UserMealsProp } from "../utils/types";
import { AuthContext } from "../Store/AuthContext";
import moment from "moment";
import { MealsHistoryContext } from "../Store/MealsHistoryContext";
import { logMeal, logMealFromBackend } from "../redux/reducers/caloriesSlice";
import { logBreakfast, logDinner, logLunch } from "../redux/reducers/mealsSlice";
import {API_URL} from "@env"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
const Home = ({ navigation }: any) => {
  const user = useContext(AuthContext)?.user;
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const [refetchMealHistory, setrefetchMealHistory] = useState(0);
  const mealsHistoryContext = useContext(MealsHistoryContext)
  const [tooltipOpen, settooltipOpen] = useState(false)

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const setmealHistory = mealsHistoryContext?.setmealHistory
  const mealHistory = mealsHistoryContext?.mealHistory;

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<any>(false);
  useEffect(() => {
    // console.log(user)
    // alert("hello")
    fetchMealHistory()
  }, [])

  const fetchMealHistory = async () => {
    // console.log(moment().startOf('day').unix())
    // console.log(moment().endOf('day').unix())
    // console.log(user?.id)
    // return;
    const response = await fetch(`http://${API_URL}/fitness-backend/api/food/index.php?userId=${user?.id}&beginningOfDay=${moment().startOf('day').unix()}&endOfDay=${moment().endOf('day').unix()}`)
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

    // console.log(initialMeals)

    dispatch(
      logMealFromBackend({
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
    setRefreshing(false)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMealHistory();
    settooltipOpen(true)
    setTimeout(() => {
      settooltipOpen(false)
    }, 2000);
  }, []);
  

  const theme = themeContext.theme;

  const caloriesInformation = useSelector((state: RootState) => state.userCalories)
  const mealsInformation = useSelector((state: RootState) => state.userMeals)

  // const notificationListener = useRef<any>();
  // const responseListener = useRef<any>();

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log("Token")
  //     // updateNotificationTokenInDB(token);

  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  
  //   if (Platform.OS === 'android') {
  //     Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  
  //   return token;
  // }

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  // }, []);
  return (
    <SafeAreaView
      style={{ backgroundColor: themeContext.theme.background, flex: 1 }}
    >
      <StatusBar backgroundColor={theme.background} />

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className=" flex-1">
          <HomeHeader theme={theme} />
          <FoodSearchInput navigation={navigation} theme={theme} />
          {/* <MainCarousel theme={theme} /> */}
          <CaloriesDisplayCard theme={theme} calories={caloriesInformation} />
          <MacrosInfo theme={theme}  calories={caloriesInformation} />
          {/* <GoalSummary theme={theme} /> */}


          <Tooltip containerStyle={{width: '60%', margin: 0, padding: 0}} backgroundColor={theme.accentColor} withOverlay={false} closeOnlyOnBackdropPress visible={tooltipOpen} popover={<Text className="text-white text-center"> Updated </Text>} withPointer={false} />

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
