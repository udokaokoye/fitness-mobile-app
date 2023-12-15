import { View, Text } from "react-native";
import React, { useEffect, useContext} from "react";
import { CommonThemeProp } from "../utils/commonProps";
// import CaloriesIntake from "./CaloriesIntake";
import { RootState, UsersCaloriesProp } from "../utils/types";
import ProgressCircle from "./ProgressCircle";
import { AuthContext } from "../Store/AuthContext";

interface ComponentProps {
  calories: UsersCaloriesProp;
}


const CaloriesDisplayCard: React.FC<CommonThemeProp & ComponentProps> = ({
  theme,
  calories,
}) => {
  
  const user = useContext(AuthContext)?.user
  const {dailyCaloriesGoal, currentCaloriesConsumption} = calories

  const calculateSliderPercentage = (current: number, total:number): number => {
    const returnValue = (current/total) * 100

    return returnValue;
  }


  
  return (
    <View className="px-5">
      <View className=" rounded-xl" style={{ width: "100%", height: 250 }}>
        <View className=" justify-center items-center">
          <View
            className="items-center justify-center overflow-hidden"
            style={{ width: "100%", height: "100%" }}>
            <ProgressCircle
              progressValue={currentCaloriesConsumption}
              progressTitle={`Goal: ${user?.daily_calories} Kcal`}
              strokeSize={10}
              size={600}
              percentageUsed={calculateSliderPercentage(currentCaloriesConsumption, user?.daily_calories || 0)}
              color={theme.accentColor}
              progressValueTextSize={40}
              progressTitleTextSize={16}
              theme={theme}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CaloriesDisplayCard;
