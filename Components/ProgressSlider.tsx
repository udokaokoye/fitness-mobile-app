import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";
import { CommonThemeProp } from "../utils/commonProps";

interface ComponentProps {
value: number
}
const ProgressSlider: React.FC<ComponentProps & CommonThemeProp> = ({
  theme,
  value
}) => {

    const [x, setx] = useState(new Animated.Value(-100))



  useEffect(() => {
    slide()
  }, []);

const  slide = () => {
    Animated.timing(x, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true
    }).start();
    
  };

  return (
<View className="border border-gray-200 rounded-xl overflow-hidden my-3" style={{width: 100, height:6, backgroundColor: theme.lighterBackground}}>
<Animated.View style={{width: `${value}%`, height: '100%', backgroundColor: theme.accentColor, transform: [ {
        translateX: x
    }]}}>
    </Animated.View>
</View>
  );
};

export default ProgressSlider;

const styles = StyleSheet.create({
  progressText: {
    // fontSize: ,
    color: "rgba(256,256,256,0.7)",
    // width: 200,
    textAlign: "center",
  },
});
