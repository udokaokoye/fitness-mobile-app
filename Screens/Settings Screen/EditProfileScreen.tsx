import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
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
import { Theme, blackTheme } from "../../Store/themes";
import { NavigationProps } from "../../utils/commonProps";
import { Icon } from "@rneui/base";
import { ThemeContext } from "../../Store/ThemeContext";
import { AuthContext } from "../../Store/AuthContext";
import RBSheet from "react-native-raw-bottom-sheet";
import { heightData, updateUserAsyncStorage } from "../../utils/lib";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@env";
import { S3Client, PutObjectCommand, DeleteObjectsCommand, S3, DeleteObjectsCommandInput } from "@aws-sdk/client-s3";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen: React.FC<NavigationProps> = ({ navigation }) => {

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'AKIA6KNJFNGWH6LUMSGV',
      secretAccessKey: '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',
    },
  })

  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const refRBSheet = useRef<any>();
  const [image, setImage] = useState<String | null>(null);

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
    getUser()
    // console.log((Dimensions.get('screen').height / 2) * 100)
    const arrayFrom1To100 = Array.from(
      { length: 100 },
      (_, index) => index + 1
    );

    setageRange(arrayFrom1To100);
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch(`http://${API_URL}/fitness-backend/api/user/index.php?id=${user?.id}`)

    const data = await res.json();

      // return;
      await AsyncStorage.setItem('user', JSON.stringify(data.data))
      authContext?.setuser(data.data);

    } catch (error) {
      console.log(error)
    }
  }

  const updateProfileInfo = async (field = fieldToUpdate, value = valueToUpdate) => {
    // alert('hello')
    const formData = new FormData();
    // console.log(field, value)
    formData.append("id", user?.id?.toString() || "");
    formData.append("field", field);
    formData.append("value", value ? value?.toString() : "");
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
          user[field] = value;

          updateUserAsyncStorage(user);
          authContext?.setuser((prev) => ({ ...prev, ...user }));
        }
        alert(data.message);
      }
    } catch (error) {
      console.log(error)
    }
  };

  function convertToS3Url(objectKey: string) {
    const s3Url = `https://calquest.s3.us-east-1.amazonaws.com/avatars/${objectKey}.jpg`;

    return s3Url;
  }
    function getBaseNameFromS3Url(url:string) {
      // Extract the path part of the URL after the bucket name
      const path = new URL(url).pathname;

      // Remove leading slash if present and split the path by '/'
      const parts = path.startsWith('/') ? path.substring(1).split('/') : path.split('/');

      // Get the last part of the path which represents the file name
      const fileNameWithExtension = parts.pop();

      // Split the file name by '.' to separate the file name and extension
      const [baseName] = (fileNameWithExtension ?? '').split('.');

      return decodeURIComponent(baseName);
  }

  const uploadAvatarToS3 = async (file: any, s3:any) => {
    // const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    // const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
    // const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
    // const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

 
    const key = `${user?.id}_${Date.now()}_avatar`
    const params = {
      Bucket: 'calquest',
      Key: `avatars/${key}.jpg`,
      Body: {
        uri: file.uri,
        type: file.mimeType,
        name: user?.email
      },
      contentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    const s3Url = convertToS3Url(key)
    if (user) {
      await updateProfileInfo('avatar', s3Url)
      user['avatar'] = s3Url
      updateUserAsyncStorage(user)
    authContext?.setuser((prev) => ({ ...prev, ...user }))
    }
  };

async function deleteImageFromS3(key:string, s3:any) {

  const params: DeleteObjectsCommandInput = {
    Delete: {
      Objects: [
        {
          Key: `avatars/${key}.jpg`,
        },
      ],
    },
    Bucket: 'calquest',
  };

  const command = new DeleteObjectsCommand(params)
  const s3Result = await s3.send(command);
  console.log(s3Result);

  return s3Result.$metadata;
}

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      if (user?.avatar) {
        console.log(user.avatar)
        const imageKey = getBaseNameFromS3Url(user.avatar)
        await deleteImageFromS3(imageKey, s3)
        await uploadAvatarToS3(result.assets[0], s3)
        console.log('Uploaded')
      } else {
        await uploadAvatarToS3(result.assets[0], s3)
        console.log('Uploaded')
      }
      
      // await deleteImageFromS3
      // const s3Url = convertToS3Url(`${user?.email}_avatar`)
      // console.log(s3Url)

      
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      {/* Header */}
      <View
        style={{ height: 30, position: "relative" }}
        className=" mx-8 flex-row justify-center items-center"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon color={theme.text} name="arrow-back-ios" />
        </TouchableOpacity>

        <Text
          style={{ width: "100%", color: theme.text }}
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
                uri: user?.avatar ? user.avatar : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
              }}
            />
          </View>
          <TouchableOpacity onPress={(pickImage)}>
            <Text
              className="font-bold text-center mt-3"
              style={{ color: theme.accentColor }}
            >
              {user?.avatar ? "Change Profile Photo" : "Add Profile Photo"}
            </Text>
          </TouchableOpacity>
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
              theme={theme}
            // navigation={navigation}
            />
          </TouchableOpacity>
          <HorizontalRule />
          <EditProfileMenu
            // navigation={navigation}
            title="membership"
            value={"basic"}
            theme={theme}
          />
        </View>

        {/* Private Info */}

        <View className="mt-5">
          <Text style={{ color: theme.text }} className="text-lg font-bold">Private Information</Text>

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
                theme={theme}

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
                theme={theme}

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
                theme={theme}

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
                theme={theme}

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
                theme={theme}

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
            container: {
              backgroundColor: theme.background
            }
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
                  onPress={() => updateProfileInfo()}
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
                  onPress={()=>updateProfileInfo()}

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
                  onPress={()=>updateProfileInfo()}

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
  theme: Theme
}

const EditProfileMenu: React.FC<EditProfileMenuProps> = ({
  title,
  value,
  capitalize = true,
  theme
}) => {
  return (
    <View className="flex-row justify-between items-center">
      <Text style={{ fontSize: 16, color: theme.text }} className=" capitalize">
        {title}
      </Text>

      <View className="flex-row items-center">
        <Text
          style={{ fontSize: 16, color: theme.text }}
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

