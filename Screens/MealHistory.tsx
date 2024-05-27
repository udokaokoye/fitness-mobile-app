import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { NavigationProps } from '../utils/commonProps'
import { ThemeContext } from '../Store/ThemeContext';
import { blackTheme } from '../Store/themes';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '@rneui/base';
import { MealsHistoryContext } from '../Store/MealsHistoryContext';
import CustomText from '../Components/CustomText';



const MealHistory:React.FC<NavigationProps> = ( {navigation}) => {
    const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;

  const mealsHistoryContext = useContext(MealsHistoryContext);
  // const [mealHistory, setmealHistory] = useState(mealsHistoryContext?.mealHistory)
const mealHistory = mealsHistoryContext?.mealHistory

useEffect(() => {
  console.log(mealHistory)
}, [mealHistory])

  
  return (
    <SafeAreaView style={{backgroundColor: theme.background, flex: 1}}>
        <StatusBar backgroundColor={theme.background} />

<View className="flex-row items-center justify-between mx-5 pb-3 mt-3">
  <Icon
    name="back"
    type="antdesign"
    color={theme.text}
    style={{ textAlign: "left" }}
    onPress={() => navigation.goBack()}
  />

<Text className='text-xl text-center font-bold' style={{color: theme.text}}>Meal History</Text>


<View  style={{width: 10, height: 10}}>

</View>


</View>

<ScrollView className='mx-5'>

    {mealHistory.reverse().map((foodHistory:any) => (
        <TouchableOpacity onPress={() => navigation.navigate('loggedFoodDetails', {food: foodHistory})} key={foodHistory.created_at} style={{backgroundColor: theme.background2}} className=' flex-row  justify-between items-center mt-5 rounded-lg  p-3'>
        <View className='flex-row gap-x-5'>
        {/* <View className=' rounded-full items-center justify-center' style={{backgroundColor: theme.accentColor, width: 50, height: 50}}>
         <Icon name='utensils' type='font-awesome-5' />
         </View> */}
 
         <View>
             <Text className='text-lg' style={{color: theme.text}}>{foodHistory.name}</Text>
             <View className='flex-row gap-x-3 mt-2'>
             <Text className=' text-gray-400'>{foodHistory.calories} Cal</Text>
             <Text className=' text-gray-400'>{foodHistory.serving} serv</Text>
             <Text className=' text-gray-400'>{foodHistory.protein}g protein</Text>
             <Text className=' text-gray-400'>{foodHistory.fat}g fat</Text>
             <Text className=' text-gray-400'>{foodHistory.carbohydrate}g carbs</Text>
             </View>
         </View>
        </View>
 
         <View><Icon name='more-horizontal' type='feather' color={theme.text} /></View>
       </TouchableOpacity>
    ))}

    {mealHistory.length == 0 && (
        <CustomText className='text-lg text-center mt-10'>No Meals Logged Yet</CustomText>
    )}
</ScrollView>

        </SafeAreaView>
  )
}

export default MealHistory