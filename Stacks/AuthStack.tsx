import { View, Text } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Auth from "../Screens/Auth";
import Login from "../Screens/Login";
import Signup from "../Screens/Signup";

const AuthStackNavigator = createNativeStackNavigator();

const AuthStack = () => {
  return <AuthStackNavigator.Navigator>
    <AuthStackNavigator.Screen name="auth" component={Auth} options={{headerShown: false}} />
    <AuthStackNavigator.Screen name="login" component={Login} options={{headerShown: false}} />
    <AuthStackNavigator.Screen name="signup" component={Signup} options={{headerShown: false}} />
  </AuthStackNavigator.Navigator>;
};

export default AuthStack;
