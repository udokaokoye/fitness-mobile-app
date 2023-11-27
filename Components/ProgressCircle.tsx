import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";

import Svg, { Circle } from "react-native-svg";
import { CommonThemeProp } from "../utils/commonProps";

// const BACKGROUND_COLOR = "#444B6F";
// const BACKGROUND_STROKE_COLOR = "#303858";
// const STROKE_COLOR = "#EA3B46";

// const { width, height } = Dimensions.get('window');
// alert(Dimensions.get('screen').height)

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface ComponentProps {
  percentageUsed: number;
  color: string;
  size: number;
  strokeSize: number;
  progressValue: number;
  progressTitle?: any;
  progressValueTextSize: number;
  progressTitleTextSize: number;
  progressUnits?: string;
  overflowProgressColor?: string;
  fastingTime?: string;
}
const ProgressCircle: React.FC<ComponentProps & CommonThemeProp> = ({
  percentageUsed,
  color,
  size,
  strokeSize,
  progressValue,
  overflowProgressColor,
  progressTitle,
  fastingTime,
  progressValueTextSize,
  progressTitleTextSize,
  progressUnits,
  theme,
}) => {
  const width = size;
  const height = size;
  const CIRCLE_LENGTH = size; // 2PI*R
  const R = CIRCLE_LENGTH / (2 * Math.PI);

  const progress = useSharedValue(0);
  const overflowProgress = useSharedValue(0);
  const actualPercentageValue = (percentageUsed / 100) * size;
  const percentageOverflowed = ((percentageUsed - 100) / 100) * size;

  strokeSize = percentageUsed > 100 ? strokeSize + 5 : strokeSize;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - actualPercentageValue * progress.value,
  }));
  const overflowAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      CIRCLE_LENGTH - percentageOverflowed * overflowProgress.value,
  }));

  const fastingAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - (size - 80),
  }));
  const progressText = useDerivedValue(() => {
    const res =  `${Math.floor(
      progress.value * (progressValue)
    )}`;
    // console.log(res)
    return res
  });

  useEffect(() => {
    onPress();
  }, []);

  const onPress = useCallback(() => {
    progress.value = withTiming(
      progress.value > 0 ? 0 : 1,
      { duration: 2000 },
      (isFinished) => {
        overflowProgress.value = withTiming(
          overflowProgress.value > 0 ? 0 : 1,
          { duration: 500 }
        );
      }
    );
    // progress.value == 1 && console.log("HIT")
    // setTimeout(() => {
    //   overflowProgress.value = withTiming(overflowProgress.value > 0 ? 0 : 1, { duration: 3000 })
    // }, (2000));
  }, []);

  return (
    <View
      className=" flex relative items-center justify-center"
      style={{ width: size / 2, height: size / 2 }}
    >
      <Svg style={{ position: "absolute", transform: [{ rotate: "-80deg" }] }}>
        {/* Fasting progress background */}
        {fastingTime && (
          <Svg style={{ position: "absolute" }}>
            <AnimatedCircle
              cx={width / 4}
              cy={height / 4}
              r={R}
              stroke={"#34383f"}
              strokeWidth={strokeSize}
              strokeDasharray={CIRCLE_LENGTH}
              animatedProps={fastingAnimatedProps}
              strokeLinecap={"round"}
              // fill={percentageUsed > 100 ? 'red' : 'black'}
            />
          </Svg>
        )}

        <AnimatedCircle
          cx={width / 4}
          cy={height / 4}
          r={R}
          stroke={color}
          strokeWidth={strokeSize}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={"round"}
          fill={theme.background2}
        />
      </Svg>

      {/* This Circle id for overflow */}
      {percentageUsed > 100 && (
        <Svg
          style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
        >
          <AnimatedCircle
            cx={width / 4}
            cy={height / 4}
            r={R}
            stroke={overflowProgressColor ? overflowProgressColor : "white"}
            strokeWidth={strokeSize}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={overflowAnimatedProps}
            strokeLinecap={"round"}
            // fill={percentageUsed > 100 ? 'red' : 'black'}
          />
        </Svg>
      )}

      {/* this extra circle is used to fix the size of the circle whit it overflows */}
      {percentageUsed > 100 && (
        <Svg
          style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
        >
          <AnimatedCircle
            cx={width / 4}
            cy={height / 4}
            r={R}
            stroke={"transparent"}
            strokeWidth={strokeSize}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={overflowAnimatedProps}
            strokeLinecap={"round"}
            // fill={percentageUsed > 100 ? 'red' : 'black'}
          />
        </Svg>
      )}

      <View
        style={{ width: width, height: height }}
        className=" absolute justify-center items-center"
      >
        {progressValue !==undefined || progressValue !==null ? (
          <View className="flex-row items-end">
            <ReText
              style={{
                ...styles.progressText,
                fontSize: progressValueTextSize,
                color: theme.text,
              }}
              text={progressText}
            />
            {progressUnits && (
              <Text style={{ color: theme.text }}>{progressUnits}</Text>
            )}
          </View>
        ) : ""}

        {/* {fastingTime && (
          <Text
            style={{
              ...styles.progressText,
              fontSize: progressValueTextSize,
            }}
          >
            {fastingTime}
          </Text>
        )} */}

        {progressTitle && (
          <Text
            className="text-xs mt-2"
            style={{
              color: theme.lighterText,
              fontSize: progressTitleTextSize,
            }}
          >
            {progressTitle}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProgressCircle;

const styles = StyleSheet.create({
  progressText: {
    // fontSize: ,
    // width: 200,
    textAlign: "center",
  },
});
