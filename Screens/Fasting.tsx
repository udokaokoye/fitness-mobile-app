import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import HomeHeader from "../Components/HomeHeader";
import FastingCard from "../Components/FastingCard";
import { useSelector } from "react-redux";
import CustomText from "../Components/CustomText";
import { RootState } from "../utils/types";

const Fasting = () => {
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const dd = useSelector((state:RootState) => state.userCalories)
  return (
    <SafeAreaView
      style={{ backgroundColor: themeContext.theme.background, flex: 1 }}
    >
      <ScrollView>
        <HomeHeader theme={theme} />
        <View className="px-5">
          <CustomText>{dd.currentCaloriesConsumption}</CustomText>
        {/* <FastingCard theme={theme} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Fasting;
