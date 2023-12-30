import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { blackTheme } from "../../Store/themes";
import { NavigationProps } from "../../utils/commonProps";
import { Icon } from "@rneui/base";
import { ThemeContext } from "../../Store/ThemeContext";
import { AuthContext } from "../../Store/AuthContext";
import RBSheet from "react-native-raw-bottom-sheet";
import { heightData, updateUserAsyncStorage } from "../../utils/lib";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@env";
import moment from "moment";

const EditProfileScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const refRBSheet = useRef<any>();

  const [valueToUpdate, setvalueToUpdate] = useState<any>("");
  const [fieldToUpdate, setfieldToUpdate] = useState("");

  //   Ranges
  const [ageRange, setageRange] = useState<number[]>([]);
  const [genderRange, setgenderRange] = useState([
    "",
    "Male",
    "Female",
    "Other",
  ]);

  useEffect(() => {
    // console.log((Dimensions.get('screen').height / 2) * 100)
    const arrayFrom1To100 = Array.from(
      { length: 100 },
      (_, index) => index + 1
    );

    setageRange(arrayFrom1To100);
  }, []);
  const updateProfileInfo = async () => {
    // alert('hello')
    const formData = new FormData();
    formData.append("id", user?.id?.toString() || "");
    formData.append("field", fieldToUpdate);
    formData.append("value", valueToUpdate ? valueToUpdate?.toString() : "");
    formData.append("updatedAt", moment().unix().toString());
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
          user[fieldToUpdate] = valueToUpdate;

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
    <SafeAreaView>
      {/* Header */}
      <View
        style={{ height: 30, position: "relative" }}
        className=" mx-8 flex-row justify-center items-center"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon color={theme.text} name="arrow-back-ios" />
        </TouchableOpacity>

        <Text
          style={{ width: "100%" }}
          className="text-lg font-bold text-center"
        >
          My Profile
        </Text>
      </View>

      <ScrollView className="mx-5">
        {/* Avatar */}
        <View className="mt-10">
          <View className="rounded-full overflow-hidden mx-auto">
            <Image
              style={{ width: 120, height: 120 }}
              source={{
                uri: "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
              }}
            />
          </View>
          <Text
            className="font-bold text-center mt-3"
            style={{ color: theme.accentColor }}
          >
            {user?.avatar ? "Change Profile Photo" : "Add Profile Photo"}
          </Text>
        </View>

        {/* Name Update */}
        <View
          style={{ backgroundColor: theme.background }}
          className="mt-5 rounded-lg p-3"
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("editProfileInput", {
                title: "name",
                field: "name",
                value: user?.firstName + " " + user?.lastName,
              });
            }}
          >
            <EditProfileMenu
              title="name"
              value={user?.firstName + " " + user?.lastName}
              // navigation={navigation}
            />
          </TouchableOpacity>
          <HorizontalRule />
          <EditProfileMenu
            // navigation={navigation}
            title="membership"
            value={"basic"}
          />
        </View>

        {/* Private Info */}

        <View className="mt-5">
          <Text className="text-lg font-bold">Private Information</Text>

          <View
            style={{ backgroundColor: theme.background }}
            className="p-3 mt-3 rounded-lg"
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("editProfileInput", {
                  title: "email",
                  field: "email",
                  value: user?.email,
                });
              }}
            >
              <EditProfileMenu
                // navigation={navigation}
                title="email"
                value={user?.email}
                capitalize={false}
              />
            </TouchableOpacity>

            <HorizontalRule margin={15} />
            <TouchableOpacity
              onPress={() => {
                setvalueToUpdate(user?.age);
                setfieldToUpdate("age");
                refRBSheet.current.open();
              }}
            >
              <EditProfileMenu
                //   navigation={navigation}
                title="age"
                value={user?.age}
              />
            </TouchableOpacity>
            <HorizontalRule margin={15} />

            <TouchableOpacity
              onPress={() => {
                setvalueToUpdate(user?.gender);
                setfieldToUpdate("gender");
                refRBSheet.current.open();
              }}
            >
              <EditProfileMenu
                //   navigation={navigation}
                title="Gender"
                value={user?.gender}
              />
            </TouchableOpacity>
            <HorizontalRule margin={15} />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("editProfileInput", {
                  title: "weight",
                  field: "weight",
                  value: user?.weight,
                });
              }}
            >
              <EditProfileMenu
                //   navigation={navigation}
                title="weight"
                value={user?.weight + " lb"}
                capitalize={false}
              />
            </TouchableOpacity>
            <HorizontalRule margin={15} />

            <TouchableOpacity
              onPress={() => {
                setvalueToUpdate(user?.height);
                setfieldToUpdate("height");
                refRBSheet.current.open();
              }}
            >
              <EditProfileMenu
                title="height"
                value={
                  heightData.filter(
                    (hData) => parseInt(hData.CM) == user?.height
                  )[0]?.Foot
                }
                //   navigation={navigation}
              />
            </TouchableOpacity>
          </View>
        </View>

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          height={400}
          customStyles={{
            wrapper: {
              backgroundColor: "transparent",
              // height: 500
            },
            draggableIcon: {
              backgroundColor: "#000",
            },
          }}
        >
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              setvalueToUpdate("");
              setfieldToUpdate("");
            }}
            className="flex-row justify-end mx-5 mt-2 p-3"
          >
            <Icon style={{ fontWeight: "bold" }} name="close" />
          </TouchableOpacity>
          {fieldToUpdate == "height" && (
            <View>
              <Picker
                selectedValue={valueToUpdate}
                onValueChange={(itemValue, itemIndex) => {
                  //  set(itemValue);
                  setvalueToUpdate(itemValue);
                }}
                // style={{backgroundColor: '#ececec', borderRadius: 30}}
              >
                {heightData.map((heightInfo) => (
                  <Picker.Item
                    color={theme.text}
                    key={heightInfo.CM}
                    label={`${heightInfo?.Foot} ( ${heightInfo.CM}CM)`}
                    value={heightInfo.CM}
                  />
                ))}
              </Picker>
              <View>
                <TouchableOpacity
                  className="rounded-xl justify-center items-center mx-auto"
                  style={{
                    width: "80%",
                    height: 60,
                    backgroundColor: theme.accentColor,
                  }}
                  onPress={updateProfileInfo}
                >
                  <Text className="font-bold text-white">Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {fieldToUpdate == "age" && (
            <View>
              <Picker
                selectedValue={valueToUpdate}
                onValueChange={(itemValue, itemIndex) => {
                  //  set(itemValue);
                  setvalueToUpdate(itemValue);
                }}
                // style={{backgroundColor: '#ececec', borderRadius: 30}}
              >
                {ageRange.map((age, index) => (
                  <Picker.Item
                    color={theme.text}
                    key={index}
                    label={age.toString()}
                    value={age}
                  />
                ))}
              </Picker>

              <View>
                <TouchableOpacity
                  className="rounded-xl justify-center items-center mx-auto"
                  style={{
                    width: "80%",
                    height: 60,
                    backgroundColor: theme.accentColor,
                  }}
                  onPress={updateProfileInfo}

                >
                  <Text className="font-bold text-white">Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {fieldToUpdate == "gender" && (
            <View>
              <Picker
                selectedValue={valueToUpdate}
                onValueChange={(itemValue, itemIndex) => {
                  //  set(itemValue);
                  setvalueToUpdate(itemValue);
                }}
                // style={{backgroundColor: '#ececec', borderRadius: 30}}
              >
                {genderRange.map((gender, index) => (
                  <Picker.Item
                    color={theme.text}
                    key={index}
                    label={gender}
                    value={gender}
                  />
                ))}
              </Picker>

              <View>
                <TouchableOpacity
                  className="rounded-xl justify-center items-center mx-auto"
                  style={{
                    width: "80%",
                    height: 60,
                    backgroundColor: theme.accentColor,
                  }}
                  onPress={updateProfileInfo}

                >
                  <Text className="font-bold text-white">Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

interface EditProfileMenuProps {
  //   navigation: NavigationProps
  title: string;
  value: any;
  capitalize?: boolean;
}

const EditProfileMenu: React.FC<EditProfileMenuProps> = ({
  title,
  value,
  capitalize = true,
}) => {
  return (
    <View className="flex-row justify-between items-center">
      <Text style={{ fontSize: 16 }} className=" capitalize">
        {title}
      </Text>

      <View className="flex-row items-center">
        <Text
          style={{ fontSize: 16 }}
          className={`${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </Text>
        <Icon name="chevron-right" />
      </View>
    </View>
  );
};

type HorizontalRuleProps = {
  margin?: number;
};
const HorizontalRule: React.FC<HorizontalRuleProps> = ({ margin = 10 }) => {
  return (
    <View
      style={{ marginVertical: margin }}
      className="border border-gray-200"
    ></View>
  );
};
