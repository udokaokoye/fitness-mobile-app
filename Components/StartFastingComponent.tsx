import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { Icon } from "@rneui/base";
import { Theme } from "../Store/themes";
import { AuthContext, UserInfoProps } from "../Store/AuthContext";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StartFastingComponentProps = {
  theme: Theme;
  user: UserInfoProps | null | undefined;
};
const StartFastingComponent: React.FC<StartFastingComponentProps> = ({
  theme,
  user
}) => {
  const [activeFastingOption, setactiveFastingOption] = useState<any>(null);
  const fastingOptions = [
    {
      name: "16:8",
      description: "16 hours of fasting, 8 hours of eating",
      info: "The 16/8 method, also known as time-restricted eating, involves a daily fasting period of 16 hours followed by an 8-hour eating window. For example, one might fast from 8:00 PM to 12:00 PM the next day, concentrating meals between 12:00 PM and 8:00 PM. This approach is popular for its simplicity and ease of integration into daily routines.",
    },
    {
      name: "18:6",
      description: "18 hours of fasting, 6 hours of eating",
      info: "the 18/6 method extends the fasting period to 18 hours, allowing for a 6-hour eating window. This approach may offer increased fat-burning benefits during the extended fasting period, appealing to individuals looking for a more prolonged period of calorie restriction.",
    },
    {
      name: "20:4",
      description: "20 hours of fasting, 4 hours of eating",
      info: 'he Warrior Diet involves a 20-hour fasting period, with a 4-hour eating window typically in the evening. This method emphasizes undereating during the day and consuming a larger meal at night, aligning with the idea of eating like a "warrior" in the evening hours.',
    },
    {
      name: "24:0",
      description: "24 hours of fasting, 0 hours of eating",
      info: "A 24-hour fast entails abstaining from food for a full day, either once or twice a week. This approach provides a more extended fasting period, promoting fat oxidation and cellular repair. It may be suitable for individuals seeking less frequent but more intense fasting experiences.",
    },
    {
      name: "36:0",
      description: "36 hours of fasting, 0 hours of eating",
      info: "This fasting method extends the fasting window to 36 hours, meaning individuals refrain from consuming calories for a full day and a half. For example, one might start fasting after dinner and continue until the following day's breakfast. Extended fasting periods like 36:0 can lead to deeper levels of autophagy and may be used intermittently for those seeking more prolonged metabolic benefits.",
    },
    {
      name: "42:0",
      description: "42 hours of fasting, 0 hours of eating",
      info: "the 42:0 fasting method extends the fasting window to 42 hours, equating to a day and three-quarters without food intake. This approach pushes the boundaries of intermittent fasting and requires careful attention to hydration and nutritional needs during non-fasting periods.",
    },
    {
      name: "48:0",
      description: "48 hours of fasting, 0 hours of eating",
      info: "he 48:0 fasting method involves a full 48-hour fasting period without calorie consumption. Individuals might initiate the fast after dinner and break it with the next day's dinner. Extended fasts like 48:0 are less frequent but may offer profound metabolic and cellular benefits. It's crucial to approach such extended fasts with caution and consider individual health conditions.",
    },
  ];

  const authContext = useContext(AuthContext);

  const updateUserFastingPreference = async () => {
    if (user) {
      // update user in db
      const res = await fetch(`http://${API_URL}/fitness-backend/api/fasting/updateFastingPreference.php?userId=${user.id}&fastingPreference=${activeFastingOption.name}`)
      const data = await res.json();
      if (data.status !== 200) {
        alert(data.message)
      } else {
        alert(data.message)
        // update user in context
        user['fasting_preference'] = activeFastingOption.name;
        authContext?.setuser((prev) => ({ ...prev, ...user }));
        await AsyncStorage.setItem('user', JSON.stringify(user))
      }
    }

  };
  return (
    <View className="mx-5 mt-5 ">
      <Text className="text-center text-2xl font-bold">
        Start Intermittent Fasting Today!
      </Text>
      <Text style={{ opacity: 0.5 }} className=" text-center font-bold">
        Select your fasting preference below
      </Text>

      <View style={{ width: "100%" }} className="mt-5">
        <Text>select one for more info</Text>
        <View className="flex-row gap-y-3 flex-wrap mt-2">
          {fastingOptions.map((option) => (
            <TouchableOpacity
              onPress={() => setactiveFastingOption(option)}
              style={{ backgroundColor: activeFastingOption?.name == option.name ? theme.accentColor : 'transparent' }}
              className=" rounded-xl mr-3 px-8 py-3 border-2 border-gray-800"
              key={option.name}
            >
              <Text style={{ color: activeFastingOption?.name == option.name ? 'white' : 'black' }} className="font-bold text-lg">
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeFastingOption && (
        <View className="mt-5">
          <Icon name="info" size={30} style={{ alignSelf: 'flex-start' }} />

          <Text className="mt-3 text-xl">{activeFastingOption.description}</Text>

          <Text className="mt-2 text-base opacity-70">{activeFastingOption.info}</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => updateUserFastingPreference()}>
        <View
          style={{ backgroundColor: theme.accentColor }}
          className="mt-5 rounded-lg p-3"
        >
          <Text style={{ color: "white" }} className="text-center font-bold">
            Start Fasting
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default StartFastingComponent;
