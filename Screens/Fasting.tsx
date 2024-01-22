import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import HomeHeader from "../Components/HomeHeader";
import FastingCard from "../Components/FastingCard";
import { useSelector } from "react-redux";
import CustomText from "../Components/CustomText";
import { RootState } from "../utils/types";
import moment from "moment";
import FastingCircle from "../Components/FastingCircle";
import { FastingContext } from "../Store/FastingContext";
import { AuthContext } from "../Store/AuthContext";
import StartFastingComponent from "../Components/StartFastingComponent";
import { API_URL } from "@env";
import { set } from "lodash";

const Fasting = () => {
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;

  const [currentFastTime, setcurrentFastTime] = useState<string>("00:00:00");
  const [intervalId, setintervalId] = useState(null);
  // const [isFasting, setisFasting] = useState(false)
  const [timeCompletedInPercentage, settimeCompletedInPercentage] = useState(0);
  const [currentTimeNow, setcurrentTimeNow] = useState(moment().toDate().getTime())
  const fastingContext = useContext(FastingContext);
  const [fastingId, setfastingId] = useState(null)

  const isFasting = fastingContext?.isFasting;
  const user = useContext(AuthContext)?.user;

  useEffect(() => {
    // console.log(isFasting);
    if (isFasting) {
      const id: any = setInterval(displayTime, 1000);
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

  useEffect(() => {
    fetchAndResumeFasting();
    // console.log(user?.fasting_preference);
  }, []);

  function displayTime() {
    const currentTime = new Date().getTime() - currentTimeNow;
    const hours = Math.floor(currentTime / 3600000);
    const minutes = Math.floor((currentTime % 3600000) / 60000);
    const seconds = Math.floor((currentTime % 60000) / 1000);

    const display = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setcurrentFastTime(display);
    // console.log(calculateTimePercentage(startTime, endTime))
    settimeCompletedInPercentage(
      calculateTimePercentage(
        fastingContext?.fastingInfo?.startTime,
        fastingContext?.fastingInfo.endTime
      )
    );
  }
  const toggleInterval = async () => {
    if (!isFasting) {
      let startTime = moment().toDate().getTime();
      let endTime = moment().add(user?.fasting_preference.split(":")[0], "hours").toDate().getTime();
      await startFast(startTime.toString(), endTime.toString());
      fastingContext?.setfastingInfo({
        startTime: startTime,
        endTime: endTime,
      });
    } else {
      endFast();
    }
    setcurrentTimeNow(moment().toDate().getTime())
    fastingContext?.setisFasting(!isFasting);
  };

  function calculateTimePercentage(currentTime: any, endTime: any) {
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

const startFast = async (startTime:string, endTime:string) => {
  const formData = new FormData();
  formData.append("userId", user?.id?.toString() || "");
  formData.append("fastingStart",startTime);
  formData.append("fastingEnd", endTime);
  const res = await fetch(`http://${API_URL}/fitness-backend/api/fasting/index.php`, {
    method: "POST",
    body: formData,
  })
  const data = await res.json();
  if (data.status !== 200) {
    console.log(data.message)
  } else {
    console.log(data.data)
    setfastingId(data.data)
  }
}

const resumeFast = async (startTime:number, endTime:number) => {
  if (!isFasting) {
    fastingContext?.setfastingInfo({
      startTime: startTime,
      endTime: endTime,
    });
  }
  fastingContext?.setisFasting(!isFasting);
};

const endFast = async () => {

  if (fastingId !== null) {

  const formData = new FormData();
  formData.append("fastingId", fastingId ? fastingId : "");
  formData.append('endTime', moment().toDate().getTime().toString())
  const res = await fetch(`http://${API_URL}/fitness-backend/api/fasting/endFast.php`, {
    method: 'POST',
    body: formData
  })

  const data = await res.json();
  if (data.status !== 200) {
    console.log(data.message)
  } else {
    console.log(data.message)
    fastingContext?.setisFasting(false);
    fastingContext?.setfastingInfo({
      startTime: null,
      endTime: null,
    });
    setcurrentFastTime("00:00:00");
    settimeCompletedInPercentage(0);
    setfastingId(null)
    setcurrentTimeNow(moment().toDate().getTime())
  }

      
} else {
  alert("fasting id is null, please restart app")
  return;
}

}


  const fetchAndResumeFasting = async () => {
    const res = await fetch(`http://${API_URL}/fitness-backend/api/fasting/index.php?userId=${user?.id}&latest=true`)
    const data = await res.json();
    if (data.status !== 200) {
      console.log(data.message)
    } else {
      const fastingInfo = data.data;
      setfastingId(fastingInfo.id)
      // console.log(fastingInfo.completed ? "completed" : "not completed")
      if(!fastingInfo.completed) {
        const startTime = moment(fastingInfo.startTime).toDate().getTime();
        const endTime = moment(fastingInfo.endTime).toDate().getTime();
        const currentTime = moment().toDate().getTime();
        setcurrentTimeNow(startTime)
        resumeFast(startTime, endTime);
      }
    }
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: themeContext.theme.background, flex: 1 }}
    >
      <ScrollView>
        <HomeHeader theme={theme} />
        {!user?.fasting_preference ? (
          <StartFastingComponent theme= {theme} user={user} />
        ) : (
          <View className="mx-5">
            <View
              className="mt-10 rounded-full"
              style={{
                backgroundColor: "transparent",
                height: 400,
                width: 400,
              }}
            >
              <View className=" justify-center items-center">
                {/* <View style={{width: 1000 / 3, height: 1000/3}} className="bg-green-500 rounded-full relative"> */}
                <FastingCircle
                  percentageUsed={timeCompletedInPercentage}
                  color={theme.accentColor}
                  size={1000}
                  progressTitle={
                    isFasting ? "Elapsed Time" : "Time Since Last Fast"
                  }
                  progressTitleTextSize={15}
                  progressValueTextSize={50}
                  fastingTime={currentFastTime}
                  strokeSize={40}
                  progressValue={timeCompletedInPercentage}
                  theme={theme}
                />
                {/* </View> */}
              </View>
            </View>

            {isFasting && (
              <View
                style={{ backgroundColor: theme.background2 }}
                className="flex-row justify-between mt-3 mb-5 p-5 rounded-2xl"
              >
                <View>
                  <Text
                    style={{ color: theme.text }}
                    className="text-center font-bold"
                  >
                    STARTED
                  </Text>
                  <Text
                    style={{ color: theme.accentColor }}
                    className="font-bold text-lg"
                  >
                    Today,{" "}
                    {moment(fastingContext.fastingInfo.startTime).format(
                      "hh:mm a"
                    )}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ color: theme.text }}
                    className="text-center font-bold"
                  >
                    GOAL
                  </Text>
                  <Text
                    style={{ color: theme.accentColor }}
                    className="font-bold text-lg"
                  >
                    {moment(fastingContext.fastingInfo.startTime).format(
                      "D MMM"
                    ) ==
                    moment(fastingContext.fastingInfo.endTime).format("D MMM")
                      ? "Today"
                      : moment(fastingContext.fastingInfo.endTime).format(
                          "MMM D"
                        )}
                    ,{" "}
                    {moment(fastingContext.fastingInfo.endTime).format(
                      "hh:mm a"
                    )}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={toggleInterval}
              style={{ backgroundColor: theme.accentColor }}
              className="rounded-3xl w-60 h-12 mb-10 justify-center items-center self-center"
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {isFasting ? "Stop Fasting" : "Start Fasting"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Fasting;
