import { View, Text } from "react-native";
import React from "react";
import { CommonThemeProp } from "../utils/commonProps";
import ProgressCircle from "./ProgressCircle";

const ExerciseComponent: React.FC<CommonThemeProp> = ({ theme }) => {
  return (
    <View className="px-5 mt-5">
      <Text className="text-xl" style={{ color: theme.text }}>
        Exercise
      </Text>
      <View
        className="mt-2  rounded-xl p-3"
        style={{
          width: "100%",
          height: 'auto',
          backgroundColor: theme.background2,
        }}
      >
        <View className=" flex-row justify-between items-center mt-3 gap-x-10">
          <View
            className=" ml-10 items-center justify-center"
            style={{ width: "40%", height: "80%" }}
          >
            {/* <ProgressCircle size={450} strokeSize={15} percentageUsed={80} color='orange' /> */}
          </View>
          <View style={{ width: "30%" }}>
                <View className="mb-5">
                    <Text className=" text-base text-gray-200">Calories Burned</Text>
                    <Text className=" text-green-500 font-bold">1,033/1000</Text>
                </View>

                <View className="mb-5">
                    <Text className=" text-base text-gray-200">Workout Mins</Text>
                    <Text className=" text-yellow-500 font-bold">20/30 MINS</Text>
                </View>

                <View className="mb-5">
                    <Text className=" text-base text-gray-200">Fast Hours</Text>
                    <Text className=" text-blue-500 font-bold">6/10 HRS</Text>
                </View>

          </View>
        </View>

        <View className=" border-t-4 border-b-4 py-2 border-gray-600 flex-row justify-between px-10">
            <View>
                <Text className="font-bold text-lg" style={{color: theme.text}} >Steps</Text>
                <Text style={{color: theme.text}}>4,102</Text>
            </View>

            <View>
                <Text className="font-bold text-lg" style={{color: theme.text}} >Distance</Text>
                <Text style={{color: theme.text}}>1.00 MI</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default ExerciseComponent;
