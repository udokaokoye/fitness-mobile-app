import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "@rneui/base";
import { NavigationProps } from "../utils/commonProps";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import {
  MealHistoryContextType,
  MealHistoryProps,
  MealsHistoryContext,
} from "../Store/MealsHistoryContext";
import ProgressCircle from "../Components/ProgressCircle";
import { GeneralMacros } from "../utils/types";
type ComponentProps = {
  route: any;
};
const MealDetailsScreen: React.FC<ComponentProps & NavigationProps> = ({
  route,
  navigation,
}) => {
  const meal = route.params.meal;
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const [mealHistory, setmealHistory] = useState([]);
  const [fatTotoal, setfatTotoal] = useState(0)
  const [proteinTotal, setproteinTotal] = useState(0)
  const [carbsTotal, setcarbsTotal] = useState(0)
  const [caloriesTotal, setcaloriesTotal] = useState(0)

  let mealHistoryUnFIltered = useContext(MealsHistoryContext)?.mealHistory;

  useEffect(() => {
    const fat = mealHistory.reduce((accumulator, mealObject:any) => {
      return accumulator + parseInt(mealObject.fat);
  }, 0)
  const protein = mealHistory.reduce((accumulator, mealObject:any) => {
    return accumulator + parseInt(mealObject.protein);
}, 0)

const carbs = mealHistory.reduce((accumulator, mealObject:any) => {
  return accumulator + parseInt(mealObject.carbohydrate);
}, 0)

const calories = mealHistory.reduce((accumulator, mealObject:any) => {
  return accumulator + parseInt(mealObject.calories);
}, 0)

  setfatTotoal(fat)
  setproteinTotal(protein)
  setcarbsTotal(carbs)
  setcaloriesTotal(calories)
  }, [mealHistory])
  

  useEffect(() => {
    if (meal == "Breakfast") {
      // console.log(
      //   mealHistoryUnFIltered?.filter(
      //     (foodHistory: MealHistoryProps) => foodHistory.meal == "B"
      //   )
      // );
      setmealHistory(
        mealHistoryUnFIltered?.filter(
          (foodHistory: MealHistoryProps) => foodHistory.meal == "B"
        )
      );
    } else if (meal == "Lunch") {
      setmealHistory(
        mealHistoryUnFIltered?.filter(
          (foodHistory: MealHistoryProps) => foodHistory.meal == "L"
        )
      );
    } else if (meal == "Dinner") {
      setmealHistory(
        mealHistoryUnFIltered?.filter(
          (foodHistory: MealHistoryProps) => foodHistory.meal == "D"
        )
      );
    } else {
      setmealHistory(mealHistoryUnFIltered);
    }
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <View className="flex-row items-center justify-between mx-5 pb-3 mt-3">
        <Icon
          name="back"
          type="antdesign"
          color={theme.text}
          style={{ textAlign: "left" }}
          onPress={() => navigation.goBack()}
        />

        <Text
          className=" flex-1 text-center text-lg"
          style={{ color: theme.text }}
        >
          {meal}
        </Text>

        <Icon
          name="check"
          type="antdesign"
          color={theme.accentColor}
          style={{ opacity: 0 }}
        />
      </View>

      <ScrollView className="mx-5">
        <View
          style={{ backgroundColor: theme.background2 }}
          className="mt-3 rounded-lg p-3"
        >
          <Text style={{color: theme.text}} className="text-xl text-center">
            {meal} Summary -{" "}
            <Text className="font-bold" style={{ color: theme.accentColor }}>
              12/22/23
            </Text>
          </Text>

          <View className="flex-row justify-between mt-8">
            <View>
              <Text className=" font-bold text-xl text-center text-pink-600">
                {caloriesTotal} Kcal
              </Text>
              <Text style={{color: theme.text}} className="text-center">Calories Total</Text>
            </View>
            <View>
              <Text className=" text-xl text-center text-orange-500 font-bold">
                {fatTotoal} g
              </Text>
              <Text style={{color: theme.text}} className="text-center">Fat</Text>
            </View>

            <View>
              <Text className=" text-xl text-center text-purple-600 font-bold">
                {proteinTotal} g
              </Text>
              <Text style={{color: theme.text}} className="text-center">Protein</Text>
            </View>

            <View>
              <Text className=" text-xl text-center text-green-500 font-bold">
                {carbsTotal} g
              </Text>
              <Text style={{color: theme.text}} className="text-center">Carbs</Text>
            </View>
          </View>
        </View>

        {mealHistory?.length == 0 && (
          <View className=" items-center justify-center mt-10">
            <Text className="text-xl" style={{ color: theme.text }}>
              No meals logged yet
            </Text>

            {/* button to log meal */}
            <TouchableOpacity
              onPress={() => navigation.navigate("searchFood")}
              style={{ backgroundColor: theme.accentColor }}
              className="px-5 py-2 rounded-lg mt-5"
            >
              <Text style={{ color: "white" }}>Log a meal</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{color: theme.text}} className="mt-5 text-xl">Food Consumed</Text>

        {mealHistory?.map((foodHistory: MealHistoryProps) => (
          <TouchableOpacity
            key={foodHistory.created_at}
            style={{ backgroundColor: theme.background2 }}
            className=" flex-row  justify-between items-center mt-3 rounded-lg  p-3"
            onPress={()=> navigation.navigate('loggedFoodDetails', {food: foodHistory})}
          >
            <View className="flex-row gap-x-5">
              {/* <View className=' rounded-full items-center justify-center' style={{backgroundColor: theme.accentColor, width: 50, height: 50}}>
                   <Icon name='utensils' type='font-awesome-5' />
                   </View> */}

              <View>
                <Text className="text-lg font-bold" style={{ color: theme.text }}>
                  {foodHistory.name}
                </Text>
                <Text className=" text-gray-500">
                  {foodHistory.calories} Cal
                </Text>
              </View>
            </View>

            <View>
              <Icon name="arrowright" type="antdesign" color={theme.text} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealDetailsScreen;
