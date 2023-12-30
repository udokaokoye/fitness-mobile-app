import { View, Text } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Auth from "../Screens/Auth";
import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import HealthFithnessSettings from "../Screens/Settings Screen/HealthFithnessSettings";
import Profile from "../Screens/Profile";
import EditProfileScreen from "../Screens/Settings Screen/EditProfileScreen";
import EditProfileInputScreen from "../Screens/Settings Screen/EditProfileInputScreen";

const ProfileStackNavigator = createNativeStackNavigator();

const ProfileStack = () => {
  return <ProfileStackNavigator.Navigator>
    <ProfileStackNavigator.Screen name="profile" component={Profile} options={{headerShown: false}} />
    <ProfileStackNavigator.Screen name="healthFitnessSettings" component={HealthFithnessSettings} options={{headerShown: false}} />
    <ProfileStackNavigator.Screen name="editProfile" component={EditProfileScreen} options={{headerShown: false}} />
    <ProfileStackNavigator.Screen name="editProfileInput" component={EditProfileInputScreen} options={{headerShown: false}} />
  </ProfileStackNavigator.Navigator>;
};

export default ProfileStack;
