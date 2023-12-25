import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Touchable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FoodProps, NavigationProps } from "../utils/commonProps";
import { searchFoodByID } from "../utils/lib";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import { Icon } from "@rneui/base";
import CustomText from "../Components/CustomText";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native";
import { logMeal } from "../redux/reducers/caloriesSlice";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  logBreakfast,
  logDinner,
  logLunch,
} from "../redux/reducers/mealsSlice";
import { AuthContext } from "../Store/AuthContext";
import { API_URL } from "@env";
interface ComponentProps {
  route?: any;
}

const FoodDetails: React.FC<NavigationProps & ComponentProps> = ({
  navigation,
  route,
}) => {
  const [open, setopen] = useState(true);
  const [value, setvalue] = useState("hmm");
  const [serving, setserving] = useState(1);
  const [note, setnote] = useState('')
  const [meal, setmeal] = useState<string>("");
  const [food, setfood] = useState<FoodProps | null>(null);
  const [foodMarkedAsFavorite, setfoodMarkedAsFavorite] = useState(false);
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const dispatch = useDispatch();

  const user  = useContext(AuthContext)?.user
  useEffect(() => {
    const fetchFoodInformation = async () => {
      const foodId = route.params.foodId;
      const meal = route.params.meal;
      meal ? setmeal(meal) : setmeal("");
      let foodDetails = await searchFoodByID(foodId);
      // console.log(foodDetails)
      setfood(foodDetails);
    };
    fetchFoodInformation();
  }, []);

  const dummyData: FoodProps = {
    food_id: "36421",
    food_name: "Mushrooms",
    food_sub_categories: {
      food_sub_category: ["Mushrooms", "Vegetables"],
    },
    food_type: "Generic",
    food_url: "https://www.fatsecret.com/calories-nutrition/usda/mushrooms",
    servings: {
      serving: [
        {
          calcium: "2",
          calories: "15",
          carbohydrate: "2.30",
          cholesterol: "0",
          fat: "0.24",
          fiber: "0.7",
          iron: "0.35",
          is_default: "1",
          measurement_description: "cup, pieces or slices",
          metric_serving_amount: "70.000",
          metric_serving_unit: "g",
          monounsaturated_fat: "0",
          number_of_units: "1.000",
          polyunsaturated_fat: "0.112",
          potassium: "223",
          protein: "2.16",
          saturated_fat: "0.035",
          serving_description: "1 cup pieces or slices",
          serving_id: "34244",
          serving_url:
            "https://www.fatsecret.com/calories-nutrition/usda/mushrooms?portionid=34244&portionamount=1.000",
          sodium: "4",
          sugar: "1.16",
          vitamin_a: "0",
          vitamin_c: "1.5",
          vitamin_d: "1",
        },
      ],
    },
  };

  const servingRange = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];


  const logMealHandler = async () => {
    // console.log(parseInt(food?.servings.serving[0].calories || "0"));
    // return

    dispatch(
      logMeal({
        caloriesIN:
          parseInt(food?.servings.serving[0].calories || "0") * serving,
        carbohydrate:
          parseInt(food?.servings.serving[0].carbohydrate || "0") * serving,
        protien: parseInt(food?.servings.serving[0].protein || "0") * serving,
        fat: parseInt(food?.servings.serving[0].fat || "0") * serving,
      })
    );
    switch (meal) {
      case "B":
        dispatch(
          logBreakfast({
            caloriesIN:
              parseInt(food?.servings.serving[0].calories || "0") * serving,
            carbohydrate:
              parseInt(food?.servings.serving[0].carbohydrate || "0") * serving,
            protien:
              parseInt(food?.servings.serving[0].protein || "0") * serving,
            fat: parseInt(food?.servings.serving[0].fat || "0") * serving,
          })
        );
        break;
      case "L":
        dispatch(
          logLunch({
            caloriesIN:
              parseInt(food?.servings.serving[0].calories || "0") * serving,
            carbohydrate:
              parseInt(food?.servings.serving[0].carbohydrate || "0") * serving,
            protien:
              parseInt(food?.servings.serving[0].protein || "0") * serving,
            fat: parseInt(food?.servings.serving[0].fat || "0") * serving,
          })
        );
        break;
      case "D":
        dispatch(
          logDinner({
            caloriesIN:
              parseInt(food?.servings.serving[0].calories || "0") * serving,
            carbohydrate:
              parseInt(food?.servings.serving[0].carbohydrate || "0") * serving,
            protien:
              parseInt(food?.servings.serving[0].protein || "0") * serving,
            fat: parseInt(food?.servings.serving[0].fat || "0") * serving,
          })
        );
        break;

      default:
        break;
    }

    const foodObject = {
      calories: parseInt(food?.servings.serving[0].calories || "0") * serving,
      userId: user?.id,
      meal: meal,
      created_at: moment().unix(),
      name: food?.food_name,
      apiFoodID: food?.food_id,
      serving: serving,
      notes: note,
    }

    const nutrition = {
      userId: user?.id,
      carbohydrate: parseInt(food?.servings.serving[0].carbohydrate || "0") * serving,
      protein: parseInt(food?.servings.serving[0].protein || "0") * serving,
      fat: parseInt(food?.servings.serving[0].fat || "0") * serving,
      created_at: moment().unix(),
    }
    // hello

    // const formData = new FormData()
    // // formData.append('test', 'hello')
    // formData.append('food', JSON.stringify(foodObject))
    // formData.append('nutrition', JSON.stringify(nutrition))


    const response = await fetch(`http://${API_URL}/fitness-backend/api/food/index.php`, {
      method: "POST",
      body: JSON.stringify({
        food: foodObject,
        nutrition: nutrition
      }),
    })

    const data = await response.json()

    console.log(data)
    // return;

    if (data.status == 201) {
      navigation.navigate("searchFood");
      setnote("")
    } else {
      alert("Unable to add note at this time.")
    }

  };

  if (!food) {
    return <Text>No Food</Text>;
  } else {
    return (
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <StatusBar backgroundColor={theme.background} />

        <View className="flex-row items-center justify-between mx-5 pb-3 mt-3">
          <Icon
            name="close"
            type="antdesign"
            color={theme.text}
            style={{ textAlign: "left" }}
            onPress={() => navigation.goBack()}
          />

          <Text className=" flex-1 text-center" style={{ color: theme.text }}>
            Add Food
          </Text>

          <Icon
            name="check"
            type="antdesign"
            color={theme.accentColor}
            style={{ textAlign: "right" }}
          />
        </View>

        <ScrollView className="mt-5">
          <View
            style={{ backgroundColor: theme.background2 }}
            className="mb-4 p-3 py-5 mx-5 rounded-2xl flex-row justify-between"
          >
            <View style={{ width: "90%" }}>
              <CustomText className="text-2xl font-bold">
                {food.food_name}
              </CustomText>
              <CustomText className="text-gray-500">
                {food.brand_name ? food.brand_name : "No brand"}
              </CustomText>

              <CustomText className="mt-1">
                Serving Size: {food.servings.serving[0].serving_description}
              </CustomText>
              <CustomText className="mt-2">
                Calories/Serving: {food.servings.serving[0].calories} cal
              </CustomText>
            </View>
            <TouchableOpacity
              onPress={() => setfoodMarkedAsFavorite(!foodMarkedAsFavorite)}
              style={{ width: "10%" }}
            >
              {foodMarkedAsFavorite ? (
                <Icon
                  name="star"
                  type="font-awesome"
                  color={theme.accentColor}
                />
              ) : (
                <Icon
                  name="star-o"
                  type="font-awesome"
                  color={theme.accentColor}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="px-5 flex-row items-center gap-x-10 mt-4 opacity-1">
            <View
              className="border-4 rounded-full justify-center items-center"
              style={{
                width: 100,
                height: 100,
                borderColor: theme.accentColor,
              }}
            >
              <CustomText className="text-2xl">
                {parseFloat(food.servings.serving[0].calories) * serving}
              </CustomText>
              <CustomText className="text-sm text-gray-400">Cal</CustomText>
            </View>

            <View className="flex-row gap-x-5">
              <View>
                <CustomText className=" text-center text-gray-400">
                  10%
                </CustomText>
                <CustomText className="text-center text-xl">
                  {(
                    parseFloat(food.servings.serving[0].protein) * serving
                  ).toFixed(2)}{" "}
                  g
                </CustomText>
                <CustomText className="text-center text-orange-500">
                  Protien
                </CustomText>
              </View>

              <View>
                <CustomText className=" text-center text-gray-400">
                  50%
                </CustomText>
                <CustomText className="text-center text-xl">
                  {(
                    parseFloat(food.servings.serving[0].carbohydrate) * serving
                  ).toFixed(2)}{" "}
                  g
                </CustomText>
                <CustomText className="text-center text-cyan-300">
                  Carbs
                </CustomText>
              </View>

              <View>
                <CustomText className=" text-center text-gray-400">
                  40%
                </CustomText>
                <CustomText className="text-center text-xl">
                  {(parseFloat(food.servings.serving[0].fat) * serving).toFixed(
                    2
                  )}{" "}
                  g
                </CustomText>
                <CustomText className="text-center text-purple-400">
                  Fat
                </CustomText>
              </View>
            </View>
          </View>

          <View className="mx-5 mt-5 opacity-1">
            <CustomText className="text-xl">Enter Serving Size</CustomText>

            <View className="flex-row gap-x-8 items-center">
              <View style={{ width: "60%" }}>
                <Picker
                  selectedValue={serving}
                  onValueChange={(itemValue, itemIndex) => {
                    // console.log(itemValue)
                    setserving(itemValue);
                  }}
                >
                  {servingRange.map((range) => (
                    <Picker.Item
                      color={theme.text}
                      key={range}
                      label={range}
                      value={range}
                    />
                  ))}
                </Picker>
              </View>

              <CustomText className="text-2xl">Serving</CustomText>
            </View>
          </View>

          <View className="mx-5 mt-8 flex-row justify-evenly flex-wrap opacity-1">
            <TouchableOpacity
              onPress={() => setmeal("B")}
              className=" justify-center items-center rounded-2xl"
              style={{
                width: "30%",
                height: 60,
                backgroundColor:
                  meal == "B" ? theme.accentColor : theme.background2,
              }}
            >
              <CustomText
                style={{ color: meal == "B" ? "white" : theme.text }}
                className="font-bold"
              >
                Breakfast
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setmeal("L")}
              className=" justify-center items-center rounded-2xl"
              style={{
                width: "30%",
                height: 60,
                backgroundColor:
                  meal == "L" ? theme.accentColor : theme.background2,
              }}
            >
              <CustomText
                style={{ color: meal == "L" ? "white" : theme.text }}
                className="font-bold"
              >
                Lunch
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setmeal("D")}
              className=" justify-center items-center rounded-2xl"
              style={{
                width: "30%",
                height: 60,
                backgroundColor:
                  meal == "D" ? theme.accentColor : theme.background2,
              }}
            >
              <CustomText
                style={{ color: meal == "D" ? "white" : theme.text }}
                className="font-bold"
              >
                Dinner
              </CustomText>
            </TouchableOpacity>
          </View>

          <View className="mx-5 mt-8">
            <CustomText className="text-lg font-bold">
              Notes / Comments
            </CustomText>
            <CustomText className="mt-1 text-sm">
              Useful to track how certain foods made you feel or any other
              observations.
            </CustomText>

            <TextInput
              multiline={true}
              placeholder="Comment Here..."
              className="rounded-lg border mt-2 p-5"
              style={{
                width: "100%",
                height: 150,
                borderColor: theme.lighterText,
              }}
              onChangeText={(txt) => setnote(txt)}
              value={note}
            />
          </View>

          <TouchableOpacity
            onPress={logMealHandler}
            className=" justify-center items-center self-center mt-8 mb-5 rounded-2xl"
            style={{
              width: "90%",
              height: 50,
              backgroundColor: theme.accentColor,
            }}
          >
            <Text className="text-xl font-bold" style={{ color: "white" }}>
              Log Food
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default FoodDetails;
