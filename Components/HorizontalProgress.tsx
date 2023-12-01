import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
    Easing,
  } from "react-native-reanimated";
  import { ReText } from "react-native-redash";
  
  import Svg, { Rect } from "react-native-svg";
  const AnimatedRectangle = Animated.createAnimatedComponent(Rect);

  interface ComponentProps {
    height: number;
    color: string;
    progresValue: number
  }
const HorizontalProgress: React.FC<ComponentProps> = ({height, color, progresValue}) => {
    const animationValue = useSharedValue(0);

    useEffect(() => {
        startAnimation()
    }, [])
    

    const startAnimation = () => {
        animationValue.value = withTiming(1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        });
      };

      const ttt = (progresValue*390) / 100

    // Define an animated style based on the shared value
    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: 0 + animationValue.value * (ttt), // Change the width as per your animation
        // height: 50 + animationValue.value * 100, // Change the height as per your animation
      };
    });
  return (
    // <View className='bg-red-500' style={{justifyContent: 'center', alignItems: 'center' }}>
      <Svg  fill={"pink"} width={500} height={100}>
        <AnimatedRectangle
          x={0}
          y={0}
          rx={10} // Optional: Adds rounded corners
          ry={10} // Optional: Adds rounded corners
          fill={color}
          height={height}
          animatedProps={animatedStyle}
          
        />
      {/* <Button title="Start Animation" onPress={startAnimation} /> */}
      </Svg>
    // </View>
  )
}

export default HorizontalProgress