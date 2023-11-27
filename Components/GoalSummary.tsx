import { View, Text, FlatList } from "react-native";
import React from "react";
import { CommonThemeProp } from "../utils/commonProps";
import ProgressCircle from "./ProgressCircle";

const GoalSummary: React.FC<CommonThemeProp> = ({ theme }) => {
  const dummyCount = [5, 80, 150, 60];
  
  return (
    <View className="px-5 mt-10">

        <Text style={{color: theme.text}} className="text-xl mb-3">Daily Goals</Text>
      <View className="py-5 rounded-xl" style={{backgroundColor: theme.background2}}>
      <FlatList
        data={dummyCount}
        horizontal
        className="pb-5"
        // keyExtractor={(item) => item}
        renderItem={(dt) => (
          <View className="flex-col justify-center items-center ml-2">
            <Text style={{ color: theme.text }}>Sodium</Text>
            <ProgressCircle
              progressValue={dt.item}
              progressTitle="Sodium"
              strokeSize={5}
              percentageUsed={dt.item}
              color="green"
              size={250}
              progressValueTextSize={20}
              progressTitleTextSize={13}
              progressUnits="g"
            />
            <Text style={{ color: theme.text }}>80% of daily goal</Text>
          </View>
        )}
      />
      </View>
    </View>
  );
};

export default GoalSummary;
