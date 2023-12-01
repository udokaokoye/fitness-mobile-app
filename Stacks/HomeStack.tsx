import { View, Text } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../Screens/Home";
import SearchFood from "../Screens/SearchFood";
import BarcodeScan from "../Screens/BarcodeScan";
import FoodDetails from "../Screens/FoodDetails";
import MealDetailsScreen from "../Screens/MealDetailsScreen";
import LoggedFoodDetails from "../Screens/LoggedFoodDetails";


const HomeStackScreen = createNativeStackNavigator();

const HomeStack = () => {
  return <HomeStackScreen.Navigator>
    <HomeStackScreen.Screen name="home" component={Home} options={{headerShown: false}} />
    <HomeStackScreen.Screen name="searchFood" component={SearchFood} options={{headerShown: false}} />
    <HomeStackScreen.Screen name="barcodeScan" component={BarcodeScan} options={{headerShown: false}} />
    <HomeStackScreen.Screen name="foodDetails" component={FoodDetails} options={{headerShown: false}} />
    <HomeStackScreen.Screen name="mealDetails" component={MealDetailsScreen} options={{headerShown: false}} />
    <HomeStackScreen.Screen name="loggedFoodDetails" component={LoggedFoodDetails} options={{headerShown: false}} />
  </HomeStackScreen.Navigator>;
};

export default HomeStack;
