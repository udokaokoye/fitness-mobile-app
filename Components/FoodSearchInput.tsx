import { View, Text, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { CommonThemeProp, NavigationProps } from "../utils/commonProps";
import { TouchableOpacity } from "react-native";
// import _ from "lodash";


const FoodSearchInput: React.FC<CommonThemeProp & NavigationProps> = ({theme, navigation}) => {
  const [searchQuery, setsearchQuery] = useState("");
  const [searchResults, setsearchResults] = useState([]);
  const [searchInputOnFocus, setsearchInputOnFocus] = useState(false)

  // useEffect(() => {

  // }, [searchQuery])

  const searchFood = async (txt: string) => {
    setsearchQuery(txt);
    // t;
  };

  // const suggestText = _.debounce((txt: string) => {
  //   const response = await fetch(
  //     `https://trackapi.nutritionix.com/v2/search/instant/?query=${txt}`,
  //     {
  //       headers: {
  //         "x-app-id": "40d1940d",
  //         "x-app-key": "f1d0e7572826c6c3e9dc564e33f5c4d3",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   const data = await response.json();
  //   setsearchResults(data.branded);
  //   console.log(data);
  // }, 1000);
  return (
    <View>
      <View
        className="flex-row justify-between items-center mt-5 mx-5 py-5 px-5 rounded-3xl"
        style={{ backgroundColor: theme.background2 }}
      >
        <Icon color={theme.text} name="search" type="evilicons" />

        <TouchableOpacity
          onPress={() => navigation.navigate("searchFood")}
          className=" py-2 px-5 border-gray-50 rounded-lg"
          style={{ width: "80%", }}
        >
          <Text style={{color: theme.text }}>What you eating today?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('barcodeScan')}>
            <Icon
              color={theme.text}
              name="barcode-scan"
              type="material-community"
            />
          </TouchableOpacity>
      </View>

      {searchResults?.length > 0 &&
        searchResults?.map((item: any) => {
          return (
            <View
              key={item.nix_item_id}
              className="flex-row justify-between items-center mt-5 mx-5 py-5 px-5 rounded-3xl"
              style={{ backgroundColor: "#0e0f11" }}
            >
              <Text style={{ color: theme.text }}>{item.food_name}</Text>
              {/* <Text style={{color: theme.text}}>{searchResults[0].branded[0].nf_calories}</Text> */}
            </View>
          );
        })}
    </View>
  );
};

export default FoodSearchInput;
