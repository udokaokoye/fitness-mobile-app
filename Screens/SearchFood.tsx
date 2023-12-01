import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { blackTheme } from "../Store/themes";
import { ThemeContext } from "../Store/ThemeContext";
import { Icon } from "@rneui/base";
import {
  getUsersAccessToken,
  searchFoodFromApi,
  suggestText,
} from "../utils/lib";
import { CommonThemeProp, NavigationProps } from "../utils/commonProps";
import { StatusBar } from "react-native";
import CustomText from "../Components/CustomText";
const SearchFood: React.FC<NavigationProps> = ({ navigation }) => {
  const inputRef = useRef<TextInput | null>(null);
  const [accessToken, setaccessToken] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setsearchResults] = useState<any>([]);
  const [suggestions, setsuggestions] = useState([]);
  const [showaddIconMenu, setshowaddIconMenu] = useState(null);
  const [timer, setTimer] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getUsersAccessToken();
      setaccessToken(token);
    };
    fetchToken();
  }, []);
  useEffect(() => {
    // Clear the timer when the component unmounts to prevent memory leaks
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const testFunction = () => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  const handleChange = (text: string) => {
    setsearchQuery(text);
    setsearchResults([]);
    // testFunction()
    // Clear the existing timer
    suggestText(text, setsuggestions, accessToken);
    // if (timer) {
    //   clearTimeout(timer);
    // }

    // // Set a new timer to call your function in 2 seconds if the user stops typing
    // setTimer(
    //   setTimeout(() => {
    //     if (searchQuery) {
    //       suggestText(text, setsuggestions, accessToken);
    //     }
    //   }, 300)
    // ); // 2000 milliseconds = 2 seconds
  };

  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background, flex: 1, zIndex: 5 }}
    >
      {/* <View className=" border-2 border-green-500" style={{ zIndex: 20 }}>
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 20,
            height: 40, // or you can set a specific height in pixels or other units
            zIndex: 20,
            backgroundColor: "pink",
          }}
        ></View>
        <View style={{ backgroundColor: "purple" }}>
          <Text>Hello0000</Text>
        </View>
      </View>

      <View className=" border-2 border-green-500" style={{ zIndex: 10 }}>
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 20,
            height: 40, // or you can set a specific height in pixels or other units
            zIndex: 10,
            backgroundColor: "red",
          }}
        ></View>

        <View style={{ backgroundColor: "purple" }}>
          <Text>Hello</Text>
        </View>
      </View> */}
      <StatusBar backgroundColor={theme.background} />

      <View
        style={{ zIndex: 100 }}
        className="flex-row items-center justify-between mx-5 pb-3"
      >
        <Icon
          name="close"
          type="antdesign"
          color={theme.text}
          style={{ textAlign: "left" }}
          onPress={() => navigation.goBack()}
        />

        <Text className=" flex-1 text-center" style={{ color: theme.text }}>
          Search Food
        </Text>
      </View>
      <ScrollView>
        <View
          className="flex-row justify-between items-center mt-5 mx-5 py-5 px-5 rounded-3xl"
          style={{ backgroundColor: theme.background2 }}
        >
          <Icon color={theme.text} name="search" type="evilicons" />

          <TextInput
            // ref={inputRef}
            onChangeText={(txt) => {
              handleChange(txt);
            }}
            value={searchQuery}
            placeholderTextColor={theme.text}
            className=" px-5 border-gray-50 rounded-lg"
            placeholder="What you eating today?"
            style={{ width: "80%", color: theme.text }}
            autoFocus={true}
          />
          <TouchableOpacity onPress={() => navigation.navigate("barcodeScan")}>
            <Icon
              color={theme.text}
              name="barcode-scan"
              type="material-community"
            />
          </TouchableOpacity>
        </View>

        <View
          className="mx-5"
          // style={{backgroundColor: "#0e0f11"}}
        >
          {searchResults?.length == 0 && suggestions?.length > 0 && (
            <Text style={{ color: theme.lighterText }} className="mt-5 text-lg">
              Suggestions
            </Text>
          )}
          {searchResults?.length == 0 &&
            suggestions?.length > 0 &&
            suggestions?.map((item: any, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  className="flex-row gap-x-5 items-center mt-5 rounded-3xl"
                  onPress={() =>
                    searchFoodFromApi(accessToken, item, setsearchResults)
                  }
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

                  <Text style={{ color: theme.text }}>{item}</Text>
                </TouchableOpacity>
              );
            })}

          {searchResults?.length == 0 && searchQuery !== "" && (
            <TouchableOpacity
              onPress={() =>
                searchFoodFromApi(accessToken, searchQuery, setsearchResults)
              }
              className="flex-row gap-x-5 items-center mt-5 rounded-3xl"
            >
              <View
                style={{
                  backgroundColor: theme.lighterBackground,
                  width: 30,
                  height: 30,
                }}
                className="p-2 rounded-full justify-center items-center "
              >
                <Icon size={18} name="search" type="evilicons" color={"#ccc"} />
              </View>

              <Text className="font-bold" style={{ color: theme.accentColor }}>
                Search all foods for: "{searchQuery}"
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {searchResults?.food?.length > 0 && (
          <Text
            style={{ color: theme.lighterText }}
            className="mx-5 mt-5 text-lg"
          >
            Results
          </Text>
        )}
        {searchResults == null && (
          <Text
            style={{ color: theme.lighterText }}
            className="mx-5 mt-5 text-lg"
          >
            No Results
          </Text>
        )}

        {searchResults?.food?.length > 0 &&
          searchResults?.food?.map((item: any, index: number) => {
            return (
              <View
                // className=" border-2 border-green-500"
                style={{ zIndex: showaddIconMenu == index ? 20 : 0 }}
                key={index}
              >
                {showaddIconMenu !== null && showaddIconMenu == index && (
                  <View
                    style={{
                      position: "absolute",
                      right: 40,
                      bottom: -140,
                      width: 160,
                      // height: 200, // or you can set a specific height in pixels or other units
                      zIndex: 10,
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                    className="  items-center"
                  >
                    <TouchableOpacity
                      className=" border-b border-b-gray-600 h-12  justify-center items-center"
                      style={{ width: "100%" }}
                      onPress={() => {
                        setshowaddIconMenu(null)
                        navigation.navigate("foodDetails", {
                          foodId: item.food_id,
                          meal: 'B'
                        })
                      }}
                    >
                      <Text>Breakfast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className=" border-b border-b-gray-600 h-12  justify-center items-center"
                      style={{ width: "100%" }}
                      onPress={() => {
                        setshowaddIconMenu(null)
                        navigation.navigate("foodDetails", {
                          foodId: item.food_id,
                          meal: 'L'
                        })
                      }}
                    >
                      <Text>Lunch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className=" border-b border-b-gray-600 h-12  justify-center items-center "
                      style={{ width: "100%" }}
                      onPress={() => {
                        setshowaddIconMenu(null)
                        navigation.navigate("foodDetails", {
                          foodId: item.food_id,
                          meal: 'D'
                        })
                      }}
                    >
                      <Text>Dinner</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <FoodResult
                  navigation={navigation}
                  theme={theme}
                  result={item}
                  setshowaddIconMenu={setshowaddIconMenu}
                  showaddIconMenu={showaddIconMenu}
                  index={index}
                />
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchFood;

interface FoodResultProps {
  result: any;
  navigation: any;
  setshowaddIconMenu: any;
  index: number;
  showaddIconMenu: any;
}

export const FoodResult: React.FC<CommonThemeProp & FoodResultProps> = ({
  result,
  theme,
  navigation,
  setshowaddIconMenu,
  index,
  showaddIconMenu,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        {
          setshowaddIconMenu(null)
          navigation.navigate("foodDetails", {
            foodId: result.food_id,
          })
        }
      }
      style={{ backgroundColor: theme.lighterBackground }}
      className="mx-5 flex-row justify-between items-center px-3 py-2 rounded-lg"
    >
      <View style={{ width: "90%" }}>
        <CustomText className="text-base font-bold">
          {result.food_name}
        </CustomText>
        {result.brand_name && (
          <CustomText className=" text-sm">{result.brand_name}</CustomText>
        )}
        <CustomText className=" text-sm">
          {result.servings.serving[0].calories} cal,{" "}
          {result.servings.serving[0].serving_description}
        </CustomText>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: theme.background,
          width: 40,
          height: 40,
        }}
        className="p-2 rounded-full justify-center items-center "
        onPress={() => {
          showaddIconMenu == index
            ? setshowaddIconMenu(null)
            : setshowaddIconMenu(index);
        }}
      >
        <Icon
          style={{ fontWeight: "bold" }}
          size={25}
          name="add"
          type="ionicons"
          color={theme.accentColor}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

{
  /* <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("foodDetails", {
                        foodId: item.food_id,
                      })
                    }
                    style={{ backgroundColor: theme.lighterBackground }}
                    className="mx-5 flex-row justify-between items-center px-3 py-2 rounded-lg"
                  >
                    <View style={{ width: "90%" }}>
                      <CustomText className="text-base font-bold">
                        {item.food_name}
                      </CustomText>
                      {item.brand_name && (
                        <CustomText className=" text-sm">
                          {item.brand_name}
                        </CustomText>
                      )}
                      <CustomText className=" text-sm">
                        {item.servings.serving[0].calories} cal,{" "}
                        {item.servings.serving[0].serving_description}
                      </CustomText>
                    </View>

                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.background,
                        width: 40,
                        height: 40,
                      }}
                      className="p-2 rounded-full justify-center items-center "
                      // onPress={() => }
                    >
                      <Icon
                        style={{ fontWeight: "bold" }}
                        size={25}
                        name="add"
                        type="ionicons"
                        color={theme.accentColor}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity> */
}
