import { View, Text, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { CommonThemeProp } from "../utils/commonProps";
import ProgressCircle from "./ProgressCircle";
import  moment from 'moment'

const FastingCard: React.FC<CommonThemeProp> = ({ theme }) => {
  const [currentFastTime, setcurrentFastTime] = useState<string>("00:00:00")
  const [intervalId, setintervalId] = useState(null)
  const [isFasting, setisFasting] = useState(true)
  const [timeCompletedInPercentage, settimeCompletedInPercentage] = useState(0)
// useEffect(() => {
//     console.log()
// }, [])
useEffect(() => {
  if (isFasting) {
    const id:any = setInterval(displayTime, 1000); 

    setintervalId(id);
  } else {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [isFasting]);

  let startTime = moment().toDate().getTime() ;
  let endTime = moment().add(1, "minutes").toDate().getTime() ;
  function displayTime() {
      const currentTime = new Date().getTime() - startTime;
      const hours = Math.floor(currentTime / 3600000);
      const minutes = Math.floor((currentTime % 3600000) / 60000);
      const seconds = Math.floor((currentTime % 60000) / 1000);

      const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setcurrentFastTime(display)
      // console.log(calculateTimePercentage(startTime, endTime))
      settimeCompletedInPercentage(calculateTimePercentage(startTime, endTime))
}
const toggleInterval = () => {
  setisFasting(!isFasting);
};

function calculateTimePercentage(currentTime:any, endTime:any) {
  // Parse the input times using Moment.js
  const currentTimeMoment = moment(currentTime);
  const endTimeMoment = moment(endTime);

  // Calculate the total time duration between currentTime and endTime
  const totalTime = endTimeMoment.diff(currentTimeMoment);

  // Calculate the time elapsed from currentTime to the current moment
  const timeElapsed = moment().diff(currentTimeMoment);

  // Calculate the percentage of time elapsed
  const percentageElapsed = (timeElapsed / totalTime) * 100;

  // Ensure the percentage is within the range [0, 100]
  const clampedPercentage = Math.min(100, Math.max(0, percentageElapsed));

  return clampedPercentage;
}
  return (
    <View
      className="mt-10 rounded-3xl"
      style={{ backgroundColor: theme.background2, minHeight: 400 }}
    >
      <View className=" justify-center items-center">
        <ProgressCircle
          percentageUsed={timeCompletedInPercentage}
          color="red"
          size={1000}
          progressTitle="Time Since Last Fast"
          progressTitleTextSize={15}
          progressValueTextSize={50}
          fastingTime={currentFastTime}
          strokeSize={40}
        />

        <TouchableOpacity onPress={toggleInterval} style={{backgroundColor: theme.accentColor}} className="rounded-3xl w-60 h-12 mb-10 justify-center items-center" >
          <Text  style={{color: theme.text}}>{isFasting ? "Stop Fasting" : "Start Fasting"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FastingCard;
