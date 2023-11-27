// import { View, Text, Animated, Easing } from "react-native";
// import React, { useEffect, useState } from "react";
// import { CommonThemeProp } from "../utils/commonProps";
// import { Icon } from "@rneui/base";
// import ProgressCircle from "./ProgressCircle";
// import MacrosCard from "./MacrosCard";

// const CaloriesIntake: React.FC<CommonThemeProp> = ({ theme }) => {
//   return (
//     <View
//       className=" rounded-xl"
//       style={{ width: "100%", height: 250 }}
//     >
//       {/* <View className="flex-row items-center justify-between">
//         <Text className="text-md" style={{ color: theme.text }}>
//           Calories
//         </Text>

//         <Icon color={"#ccc"} type="feather" name="edit-2" />
//       </View> */}
//       {/* <Text className="mt-2 text-sm" style={{ color: theme.text }}>Total calories intake.</Text> */}

//       <View className=" justify-center items-center">
//         <View
//           className="items-center justify-center overflow-hidden"
//           style={{ width: "100%", height: "100%" }}
//         >
//           <ProgressCircle
//             progressValue={2000}
//             progressTitle="Goal: 4000 Kcal"
//             strokeSize={10}
//             size={600}
//             percentageUsed={60}
//             color={theme.accentColor}
//             progressValueTextSize={40}
//             progressTitleTextSize={16}
//             theme={theme}
//           />
//         </View>

//       </View>
//     </View>
//   );
// };

// interface CaloriesGoalProps extends CommonThemeProp {
//   goalName: string;
//   goalnumber: number;
//   goalIconType: string;
//   goalIconName: string;
//   goalIconColor: string;
// }

// const CaloriesGoal: React.FC<CaloriesGoalProps> = ({
//   theme,
//   goalIconName,
//   goalnumber,
//   goalIconType,
//   goalName,
//   goalIconColor,
// }) => {
//   return (
//     <View className=" flex-row gap-x-2 items-center my-2">
//       <Icon color={goalIconColor} type={goalIconType} name={goalIconName} />
//       <View>
//         <Text style={{ color: theme.text }}>{goalName}</Text>
//         <Text style={{ color: theme.text }}>{goalnumber}</Text>
//       </View>
//     </View>
//   );
// };

// export default CaloriesIntake;
