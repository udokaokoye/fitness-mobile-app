import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import { NavigationProps } from "../utils/commonProps";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Store/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { getUsersAccessToken, heightData, suggestText } from "../utils/lib";
import { Icon } from "@rneui/base";
import RBSheet from "react-native-raw-bottom-sheet";
import { set } from "lodash";
import { API_URL, APP_NAME } from "@env";
import CustomText from "../Components/CustomText";

const Signup: React.FC<NavigationProps> = ({ navigation }) => {
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const authContext = useContext(AuthContext);
  const [accessToken, setaccessToken] = useState("");

  
  // Basic Info
  const [email, setemail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [password, setpassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");

  const refRBSheet = useRef<any>();

  // Profile Info
  const [age, setage] = useState(null);
  const [gender, setgender] = useState(null);
  const [height, setheight] = useState(null);
  const [weight, setweight] = useState<string | null>(null);

  //   Activity / Goals
  const [activityLevel, setactivityLevel] = useState("");
  const [goalWeight, setgoalWeight] = useState("");

  const [protein, setprotein] = useState(50)
  const [carbohydrate, setcarbohydrate] = useState(50)
  const [fat, setfat] = useState(50)

  // Diet
  const [activeDietSelection, setactiveDietSelection] = useState("");
  const [likedFoods, setlikedFoods] = useState([]);
  const [dislikedFoods, setdislikedFoods] = useState([]);

  const [error, seterror] = useState<string | null>(null);
  const [signupStage, setsignupStage] = useState("basic-info");
  const [passwordInputError, setpasswordInputError] = useState(false);

  const [caloriesGoal, setcaloriesGoal] = useState("");
  const [proteinGoal, setproteinGoal] = useState("");
  const [fatGoal, setfatGoal] = useState("");
  const [carbohydrateGoal, setcarbohydrateGoal] = useState("");

  const [foodSearchQuery, setfoodSearchQuery] = useState("");
  const [searchResult, setsearchResult] = useState([]);

  //   Ranges
  const [ageRange, setageRange] = useState<number[]>([]);
  const [genderRange, setgenderRange] = useState(["", "Male", "Female", "Other"]);
  const [activityLevelRange, setactivityLevelRange] = useState([
    "Sedentary",
    "Lightly Active",
    "Active",
    "Very Active",
  ]);

  useEffect(() => {
    // console.log((Dimensions.get('screen').height / 2) * 100)
    const arrayFrom1To100 = Array.from(
      { length: 100 },
      (_, index) => index + 1
    );

    setageRange(arrayFrom1To100);
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getUsersAccessToken();
      setaccessToken(token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const minLength = 6;
    const hasLetters = /[a-zA-Z]/;
    const hasNumbers = /\d/;
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      setpasswordInputError(true);
    }
    if (!hasLetters.test(password)) {
      setpasswordInputError(true);
    }
    if (!hasNumbers.test(password)) {
      setpasswordInputError(true);
    }
    if (!hasSpecialChars.test(password)) {
      setpasswordInputError(true);
    }

    setpasswordInputError(false);
  }, [password]);

  const validatePasswordInput = (passwordInput: string) => {
    setpassword(passwordInput);
    const minLength = 6;
    const hasLetters = /[a-zA-Z]/;
    const hasNumbers = /\d/;
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/;

    if (passwordInput.length < minLength) {
      setpasswordInputError(true);
    }
    if (!hasLetters.test(passwordInput)) {
      setpasswordInputError(true);
    }
    if (!hasNumbers.test(passwordInput)) {
      setpasswordInputError(true);
    }
    if (!hasSpecialChars.test(passwordInput)) {
      setpasswordInputError(true);
    }

    setpasswordInputError(false);
  };

  const proceedToNextStage = () => {
    if (signupStage == "basic-info") {
      // alert('hello')
      if (firstName == "" || lastName == "" || email == "") {
        alert("Please enter firstname, lastname and email address.");
        return;
      }

      // check if email already exists
      fetch(`http://${API_URL}/fitness-backend/api/auth/signup.php?email=${email}&action=checkEmail`).then((res) => res.json()).then((data) => {
        if (data.status == 200) {
          seterror(data.message)
          return
        }
        seterror(null)
        setsignupStage("password");
      })
    } else if (signupStage == "password") {
      if (password == "" || !validatePasswordInput) {
        seterror("Please enter a valid password");
        return;
      }

      if (password !== passwordConfirm) {
        console.log(password);
        console.log(passwordConfirm);
        seterror("password does not match");
        return;
      }
      seterror(null)
      setsignupStage("profile-1");
    } else if (signupStage == "profile-1") {
      if (!age || !gender || gender == "") {
        seterror('Please Select Age and Gender')
        return
      }
      seterror(null)
      setsignupStage("profile-2");
    } else if (signupStage == "profile-2") {
      if (!height || !weight) {
        seterror('Please Select Height and Weight')
        return
      }
      seterror(null)
      setsignupStage("activity-goal");
    } else if (signupStage == "activity-goal") {
      if (!activityLevel || !goalWeight || !caloriesGoal) {
        seterror('Please Select Activity Level and Goal Weight')
        return
      }
      seterror(null)
      setsignupStage("diet");
    } else if (signupStage == "diet") {
      setsignupStage("avatar");
    } else if (signupStage == "avatar") {
      completeSignup()
    }
  };



  const completeSignup = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", passwordConfirm);
    formData.append('weight', weight ? weight : '');
    formData.append('height', height ? height : '');
    formData.append('age', age ? age : '');
    formData.append('gender', gender ? gender : '')
    formData.append("activityLevel", activityLevel);
    formData.append("goalWeight", goalWeight);
    formData.append("favoriteFoods", likedFoods.join());
    formData.append("dislikedFoods", dislikedFoods.join());
    formData.append('protein', protein.toString())
    formData.append('carbohydrate', carbohydrate.toString())
    formData.append('fat', fat.toString())

    formData.append("dailyCalories", caloriesGoal);
    formData.append("createdAt", moment().unix().toString());
    
    try {
      const response = await fetch(
        `http://${API_URL}/fitness-backend/api/auth/signup.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status !== 201) {
        seterror(data.message);
        return;
      } else {
        // !we need to update the user context here
        authContext?.setuser(data.data);
        await AsyncStorage.setItem("user", JSON.stringify(data.data));
        authContext?.setisLoggedIn(true);
      }
    } catch (error) {
      console.log("error: " + error);
    }
  };
  return (
    <SafeAreaView className="flex-1 ">
      <View className="mt-20 mx-5">
        <Text className="text-2xl font-bold text-center mb-3">{APP_NAME}</Text>
        <Text className="text-center mb-5 text-base text-gray-500">
          Signup and start making healthier decisions.
        </Text>

        {error && (
          <Text className="text-center mb-5 text-red-500 font-bold">
            {error}
          </Text>
        )}

        {signupStage == "basic-info" && (
          <>
            <View className="flex-row justify-between items-center">
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(txt) => setfirstName(txt)}
                placeholder="First name"
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5"
                style={{ width: "49%", height: 40 }}
              />
              <TextInput
                autoCapitalize="none"
                onChangeText={(txt) => setlastName(txt)}
                placeholder="Last name"
                className=" bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5"
                style={{ width: "49%", height: 40 }}
              />
            </View>

            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(txt) => setemail(txt)}
              placeholder="Email"
              className="mt-3 bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5"
              style={{ width: "100%", height: 50 }}
            />

            {/* <TouchableOpacity onPress={() => setsignupStage('password')} className=' mt-5 self-center rounded-xl justify-center items-center' style={{ backgroundColor: theme.accentColor, width: '100%', height: 60 }}>
                            <Text className='text-lg text-white font-bold'>Continue</Text>
                        </TouchableOpacity> */}
          </>
        )}

        {signupStage == "password" && (
          <>
            <Text className="mb-3 text-gray-500 font-bold">
              Password should be greater than 6 characters including letters,
              numbers and special characters
            </Text>

            <TextInput
              autoCapitalize="none"
              onChangeText={(txt) => setpassword(txt)}
              secureTextEntry
              placeholder="Password"
              className=" bg-gray-200 border-2  rounded-lg self-center px-5"
              style={{
                width: "100%",
                height: 50,
                borderColor: passwordInputError ? "red" : "gray",
              }}
            />
            <TextInput
              autoCapitalize="none"
              onChangeText={(txt) => setpasswordConfirm(txt)}
              secureTextEntry
              placeholder="Confirm password"
              className="mt-3 bg-gray-200 border-2  rounded-lg self-center px-5"
              style={{ width: "100%", height: 50, borderColor: "gray" }}
            />
          </>
        )}

        {signupStage == "profile-1" && (
          <>
            <Text className="text-center text-lg font-bold text-gray-800">
              Now let's build your profile!
            </Text>

            <View className="mt-5">
              <View className="flex-row justify-between items-center">
                <View style={{ width: "50%" }}>
                  <Picker
                    selectedValue={age}
                    onValueChange={(itemValue, itemIndex) => {
                      setage(itemValue);
                    }}
                    // style={{backgroundColor: '#ececec', borderRadius: 30}}
                  >
                    {ageRange.map((range) => (
                      <Picker.Item
                        color={theme.text}
                        key={range}
                        label={`${range}`}
                        value={range}
                      />
                    ))}
                  </Picker>
                  <Text className="text-lg text-center mb-2 font-bold">
                    Age
                  </Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue, itemIndex) => {
                      setgender(itemValue);
                    }}
                    // style={{backgroundColor: '#ececec', borderRadius: 30}}
                  >
                    {genderRange.map((range) => (
                      <Picker.Item
                        color={theme.text}
                        key={range}
                        label={`${range}`}
                        value={range}
                      />
                    ))}
                  </Picker>
                  <Text className="text-lg text-center mb-2 font-bold">
                    Gender
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {signupStage == "profile-2" && (
          <>
            <Text className="text-center text-lg font-bold text-gray-800">
              Now let's build your profile!
            </Text>

            <View className="mt-5">
              <View className="flex-row justify-between items-center">
                <View style={{ width: "50%" }}>
                  <Picker
                    selectedValue={height}
                    onValueChange={(itemValue, itemIndex) => {
                      setheight(itemValue);
                    }}
                    // style={{backgroundColor: '#ececec', borderRadius: 30}}
                  >
                    {heightData.map((heightInfo) => (
                      <Picker.Item
                        color={theme.text}
                        key={heightInfo.CM}
                        label={`${heightInfo.Foot} ( ${heightInfo.CM}CM)`}
                        value={heightInfo.CM}
                      />
                    ))}
                  </Picker>
                  <Text className="text-lg text-center mb-2 font-bold">
                    Height (FT/CM)
                  </Text>
                </View>
                <View className="mt-auto" style={{ width: "50%" }}>
                  <TextInput
                    autoCapitalize="none"
                    inputMode="numeric"
                    returnKeyType="done"
                    onChangeText={(txt) => setweight(txt)}
                    placeholder="0.00lb"
                    className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5"
                    style={{ width: "100%", height: 40 }}
                  />
                  <Text className="text-lg text-center mb-2 font-bold">
                    Weight(LB)
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {signupStage == "activity-goal" && (
          <>
            <View>
              <Text className="text-lg text-center font-bold">
                Activity Level
              </Text>
              <View className="mt-8 flex-row justify-between flex-wrap opacity-1">
                {activityLevelRange.map((actvLevl) => (
                  <TouchableOpacity
                    className="mb-3 justify-center items-center rounded-2xl "
                    key={actvLevl}
                    style={{
                      backgroundColor:
                        activityLevel == actvLevl
                          ? theme.accentColor
                          : theme.background2,
                      width: "30%",
                      height: 60,
                    }}
                    onPress={() => setactivityLevel(actvLevl)}
                  >
                    <Text
                      style={{
                        color: activityLevel == actvLevl ? "white" : "black",
                        fontWeight:
                          activityLevel == actvLevl ? "bold" : "normal",
                      }}
                    >
                      {actvLevl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-center font-bold text-lg">
                Goal Weight ({goalWeight} lb)
              </Text>

              <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                returnKeyType="done"
                onChangeText={(txt) => setgoalWeight(txt)}
                placeholder="0.00 lb"
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5 mt-3"
                style={{ width: "100%", height: 50 }}
              />

              <Text className="text-center font-bold text-lg mt-5">
                Daily Calories Goal ({caloriesGoal} Kcal)
              </Text>

              <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                returnKeyType="done"
                onChangeText={(txt) => setcaloriesGoal(txt)}
                placeholder="0 Kcal"
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5 mt-3"
                style={{ width: "100%", height: 50 }}
              />
            </View>

            <Text className="text-center font-bold text-lg mt-5">
                Macros (measured in g)
              </Text>

              <View className="flex-row justify-between mt-5">

                <View style={{width: '30%'}}>
                  <CustomText className='text-center'>Protein</CustomText>
                  <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                returnKeyType="done"
                onChangeText={(txt) => setprotein(txt ? parseInt(txt) : 0)}
                placeholder="0 g"
                value={protein.toString()}
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5 mt-3"
                style={{ width: "100%", height: 50 }}
              />
                </View>

                <View style={{width: '30%'}}>
                  <CustomText className='text-center'>Carbohydrate</CustomText>
                  <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                returnKeyType="done"
                onChangeText={(txt) => setcarbohydrate(txt ? parseInt(txt) : 0)}
                placeholder="0 g"
                value={carbohydrate.toString()}
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5 mt-3"
                style={{ width: "100%", height: 50 }}
              />
                </View>

                <View style={{width: '30%'}}>
                  <CustomText className='text-center'>Fat</CustomText>
                  <TextInput
                autoCapitalize="none"
                inputMode="numeric"
                returnKeyType="done"
                onChangeText={(txt) => setfat(txt ? parseInt(txt) : 0)}
                placeholder="0 g"
                value={fat.toString()}
                className="bg-gray-200 border-2 border-gray-300 rounded-lg self-center px-5 mt-3"
                style={{ width: "100%", height: 50 }}
              />
                </View>
                </View>
                <CustomText className='mt-3 italic'>You'll be able to set more macros later in the settings.</CustomText>
          </>
        )}

        {signupStage == "diet" && (
          <>
            <Text className="text-center text-lg font-bold">
              Dietary Preferences
            </Text>

            <Text className="text-lg mt-5 mb-2">Favorite Food</Text>
            <View className="flex-row gap-x-3 mt-3 flex-wrap gap-y-2">
              {likedFoods.length > 0 &&
                likedFoods.map((likedfood, index) => (
                  <TouchableOpacity
                  key={index}
                    onPress={() => setlikedFoods(likedFoods.filter((likedfoodFromArray) => likedfoodFromArray !== likedfood))}
                    className=" justify-center items-center rounded-2xl"
                    style={{
                      minWidth: "20%",
                      // minHeight: '20%',
                      height: 30,
                      backgroundColor: theme.accentColor,
                    }}
                  >
                    <Text style={{ color: "white" }} className=" px-3 text-center font-bold">
                      {likedfood}
                    </Text>
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                onPress={() => {
                  setfoodSearchQuery("");
                  setsearchResult([]);
                  setactiveDietSelection("favorite");
                  refRBSheet?.current?.open();
                }}
                className="flex-row justify-center items-center rounded-2xl"
                    style={{
                      width: "20%",
                      height: 30,
                      backgroundColor: theme.background,
                    }}
              >
                <Text style={{color: theme.accentColor}} className="text-white font-bold">Add</Text>
                <Icon color={theme.accentColor} name="add" />
              </TouchableOpacity>
            </View>

            <Text className="text-lg mt-5 mb-2">Disliked Food Food</Text>
            <View className="flex-row gap-x-3 mt-3 flex-wrap gap-y-2">
              {dislikedFoods.length > 0 &&
                dislikedFoods.map((dislikedfoods, index) => (
                  <TouchableOpacity
                  onPress={() => setdislikedFoods(dislikedFoods.filter((dislikedfoodFromArray) => dislikedfoodFromArray !== dislikedfoods))}

                    className=" justify-center items-center rounded-2xl"
                    style={{
                      minWidth: "20%",
                      // minHeight: '20%',
                      height: 30,
                      backgroundColor: theme.accentColor,
                    }}
                    key={index}
                  >
                    <Text style={{ color: "white" }} className="px-3 text-center font-bold">
                      {dislikedfoods}
                    </Text>
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                onPress={() => {
                  setfoodSearchQuery("");
                  setsearchResult([]);
                  setactiveDietSelection("dislike");
                  refRBSheet?.current?.open();
                }}
                className="flex-row justify-center items-center rounded-2xl"
                    style={{
                      width: "20%",
                      height: 30,
                      backgroundColor: theme.background,
                    }}
              >
                <Text style={{color: theme.accentColor}} className="text-white font-bold">Add</Text>
                <Icon color={theme.accentColor} name="add" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {signupStage == "avatar" && (
          <>
            <Text className="text-center mb-3">Select an avatar</Text>

            <View
              style={{ width: 140, height: 140 }}
              className="mx-auto bg-blue-900 rounded-full"
            ></View>
          </>
        )}

        {/* {signupStage == "goals" && (
          <>
            <Text className="text-center mb-3 font-bold">
              Enter you nutrition goals
            </Text>

            <View className="mt-5">
              <View className="flex-row justify-between">
                <View style={{ width: "49%" }}>
                  <Text>Calories Goal</Text>
                  <TextInput
                    // className=" px-3 mt-2"
                    placeholder="Calories Goal"
                    value={caloriesGoal}
                    onChangeText={(txt) => setcaloriesGoal(txt)}
                    keyboardType="number-pad"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>
                <View style={{ width: "49%" }}>
                  <Text>Protein Goal (g)</Text>
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="Protein Goal (g)"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>
              </View>
              <View className="flex-row justify-between mt-5">
                <View style={{ width: "49%" }}>
                  <Text>Fat Goal</Text>
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="Fat Goal (g)"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>

                <View style={{ width: "49%" }}>
                  <Text>Carbohydrate Goal</Text>
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="Carbohydrate Goal (g)"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>
              </View>

              <TouchableOpacity className="mt-5 mb-3">
                <Text style={{ color: theme.accentColor }}>Add goals +</Text>
              </TouchableOpacity>

              <Text className="text-gray-500">
                You will be able to change goals later in settings
              </Text>
            </View>
          </>
        )} */}

        <TouchableOpacity
          onPress={() => proceedToNextStage()}
          className=" mt-5 self-center rounded-xl justify-center items-center"
          style={{
            backgroundColor: theme.accentColor,
            width: "100%",
            height: 60,
          }}
        >
          <Text className="text-lg text-white font-bold">{signupStage == 'avatar' ? 'Complete!' : 'Continue'}</Text>
        </TouchableOpacity>

        <View
          className="flex-row justify-between self-center mt-5"
          style={{ width: "100%" }}
        >
          <TouchableOpacity className="">
            <Text>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity className="">
            <Text>FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>
          {/* @ts-ignore */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get("screen").height / 1.5}
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
        <View
          className="flex-row justify-between items-center mt-5 mx-5 py-5 px-5 rounded-3xl"
          style={{ backgroundColor: theme.background2 }}
        >
          <Icon color={theme.text} name="search" type="evilicons" />

          <TextInput
            // ref={inputRef}
            onChangeText={(txt) => {
              suggestText(txt, setsearchResult, accessToken);
            }}
            // value={foodSearchQuery}
            returnKeyType="search"
            placeholderTextColor={theme.text}
            className=" px-5 border-gray-50 rounded-lg"
            placeholder="Search Food..."
            style={{ width: "80%", color: theme.text }}
            autoFocus={true}
          />
          <TouchableOpacity onPress={() => alert("Feature in development")}>
            <Icon
              color={theme.text}
              name="barcode-scan"
              type="material-community"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          {searchResult?.length > 0 &&
            searchResult.map((result, index) => (
              <View className="mx-5" key={index}>
                <TouchableOpacity
                  className=" flex-row gap-x-5 items-center mt-5 rounded-3xl"
                  onPress={() => {
                    if (activeDietSelection == "favorite") {
                      setlikedFoods((prevsData) => [...prevsData, result]);
                    } else {
                      setdislikedFoods((prevsData) => [...prevsData, result]);
                    }
                    refRBSheet?.current?.close();
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.lighterBackground,
                      width: 30,
                      height: 30,
                    }}
                    className="p-2 rounded-full justify-center items-center "
                  >
                    <Icon
                      size={16}
                      name="search"
                      type="evilicons"
                      color={"#ccc"}
                    />
                  </View>

                  <Text style={{ color: theme.text }}>{result}</Text>
                </TouchableOpacity>
              </View>
            ))}

          {searchResult?.length == 0 && (
            <Text
              style={{ color: theme.accentColor }}
              className="mx-5 font-bold"
            >
              Start Searching...
            </Text>
          )}
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Signup;
