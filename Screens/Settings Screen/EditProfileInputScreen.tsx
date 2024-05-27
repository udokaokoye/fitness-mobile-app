import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../Store/ThemeContext";
import { blackTheme } from "../../Store/themes";
import { AuthContext } from "../../Store/AuthContext";
import { Icon } from "@rneui/base";
import { NavigationProps } from "../../utils/commonProps";
import { updateUserAsyncStorage } from "../../utils/lib";
import { API_URL } from "@env";
import moment from "moment";

type EditProfileInputScreenProps = {
  route: any;
};
const EditProfileInputScreen: React.FC<
  EditProfileInputScreenProps & NavigationProps
> = ({ route, navigation }) => {
  const { title, field, value } = route.params;
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const authContext = useContext(AuthContext)
  const user = authContext?.user

  const [valueToUpdate, setvalueToUpdate] = useState(value);

  const updateProfileInfo = async() => {
    // alert(moment().unix().toString())
    // return;
    const formData = new FormData();
    formData.append("id", user?.id?.toString() || "");
    formData.append("field", field);
    formData.append("value", valueToUpdate ? valueToUpdate?.toString() : "");
    formData.append('updatedAt', moment().unix().toString())

    try {
      const res = await fetch(
        `http://${API_URL}/fitness-backend/api/user/updateSingle.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.status !== 200) {
        alert(data.message);
        return;
      } else {
        if (user) {

            user[field] = valueToUpdate;
          
          updateUserAsyncStorage(user);
          authContext?.setuser((prev) => ({ ...prev, ...user }));
        }
        alert(data.message);
      }
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
      <View
        style={{ height: 30, position: "relative" }}
        className=" mx-8 flex-row justify-center items-center"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon color={theme.text} name="arrow-back-ios" />
        </TouchableOpacity>

        <Text
          style={{ width: "100%", color: theme.text }}
          className="text-lg font-bold text-center capitalize"
        >
          {title}
        </Text>
      </View>

      {title == "weight" ? (
        <View className="mx-5 mt-5">
          <View
            className="flex-row items-center px-3 rounded-lg border border-gray-300"
            style={{
              width: "100%",
              height: 60,
              backgroundColor: theme.background,
            }}
          >
            <TextInput
              value={valueToUpdate}
              onChangeText={(txt) => setvalueToUpdate(txt)}
              placeholder="Enter Weight"
              placeholderTextColor={theme.text}
              className=" text-right bg-transparent text-xl font-bold"
              style={{ width: "90%", color: theme.accentColor }}
            />
            <Text className="text-xl ml-3 mt-2 font-bold text-gray-700">
              LB
            </Text>
          </View>

          <TouchableOpacity
            className=" mx-auto mt-5 rounded-xl justify-center items-center"
            style={{
              width: "100%",
              height: 50,
              backgroundColor: theme.accentColor,
            }}
            onPress={updateProfileInfo}

          >
            <Text className="font-bold text-white">Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mx-5 mt-5">
          <TextInput
            value={valueToUpdate}
            onChangeText={(txt) => setvalueToUpdate(txt)}
            placeholder="Email Address"
            placeholderTextColor={theme.text}
            className="px-3 py-2 rounded-lg border border-gray-300"
            style={{
              width: "100%",
              height: 40,
              backgroundColor: theme.background,
              color: theme.text
            }}
          />

          <TouchableOpacity
            className=" mx-auto mt-5 rounded-xl justify-center items-center"
            style={{
              width: "100%",
              height: 50,
              backgroundColor: theme.accentColor,
            }}

            onPress={updateProfileInfo}
          >
            <Text className="font-bold text-white">Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditProfileInputScreen;
