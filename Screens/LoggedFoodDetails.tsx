import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React,{ useContext } from 'react'
import { Icon } from '@rneui/base'
import { CommonThemeProp, NavigationProps } from '../utils/commonProps'
import { ThemeContext } from '../Store/ThemeContext';
import { blackTheme } from '../Store/themes';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../Components/CustomText';
import moment from 'moment';
type ComponentProps = {
    route: any;
  };
const LoggedFoodDetails: React.FC<NavigationProps & ComponentProps> = ( {navigation, route}) => {
    const food = route.params.food;
    const themeContext = useContext(ThemeContext) || { theme: blackTheme };
    const theme = themeContext.theme;
  return (
    <SafeAreaView className='flex-1' style={{backgroundColor: theme.background}}>
      <View style={{backgroundColor: theme.background}} className="flex-row items-center justify-between mx-5 pb-3 mt-3">
        <Icon
          name="back"
          type="antdesign"
          color={theme.text}
          style={{ textAlign: "left" }}
          onPress={() => navigation.goBack()}
        />

        <Text
          className=" flex-1 text-center text-lg"
          style={{ color: theme.text }}
        >
          {food.name}
        </Text>

        <Icon
          name="check"
          type="antdesign"
          color={theme.accentColor}
          style={{ opacity: 0 }}
        />
      </View>

      <ScrollView className="mx-5">

      <View style={{backgroundColor: theme.background2}} className="flex-row justify-between mt-3 p-5 rounded-lg">
            <View>
              <Text className=" font-bold text-xl text-center text-pink-600">
                {food.calories} Kcal
              </Text>
              <Text className="text-center">Calories Total</Text>
            </View>
            <View>
              <Text className=" text-xl text-center text-orange-500 font-bold">
                {food.fat} g
              </Text>
              <Text className="text-center">Fat</Text>
            </View>

            <View>
              <Text className=" text-xl text-center text-purple-600 font-bold">
                {food.protein} g
              </Text>
              <Text className="text-center">Protein</Text>
            </View>

            <View>
              <Text className=" text-xl text-center text-green-500 font-bold">
                {food.carbohydrate} g
              </Text>
              <Text className="text-center">Carbs</Text>
            </View>
          </View>

          <Text style={{ color: theme.text }} className='text-xl font-bold mt-5'>{food.name}</Text>

          <Text className='mt-3'>{food.note}</Text>
          <Text style={{ color: theme.text }} className='mt-8 font-bold'>Logged at: <Text style={{color: theme.accentColor}}>{moment.unix(food.created_at).format("hh:mm a")}</Text> on <Text style={{color: theme.accentColor}}>{moment.unix(food.created_at).format("DD MMM YYYY")}</Text></Text>
          {/* <Text>{food.created_at}</Text> */}

          <TouchableOpacity onPress={() => navigation.navigate('foodDetails', {
            foodId: food.apiFoodID
          })} className=' m-auto mt-5 py-3 px-3 rounded-xl' style={{backgroundColor: theme.accentColor, width: '50%'}}>
            <Text className='text-center text-white font-bold'>Log Food Again</Text>
          </TouchableOpacity>

        </ScrollView>
    </SafeAreaView>
  )
}

export default LoggedFoodDetails