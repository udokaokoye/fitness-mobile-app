import { View, Text, TouchableOpacity } from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import { CommonThemeProp, NavigationProps } from '../utils/commonProps'
import { Icon } from '@rneui/base'
import { MealHistoryProps, MealsHistoryContext } from '../Store/MealsHistoryContext'

const CaloriesHistory: React.FC<CommonThemeProp & NavigationProps> = ({theme, navigation}) => {
  const mealsHistoryContext = useContext(MealsHistoryContext);
  // const [mealHistory, setmealHistory] = useState(mealsHistoryContext?.mealHistory)
const mealHistory = mealsHistoryContext?.mealHistory
  useEffect(() => {
    // console.log(mealHistory)
  }, [mealHistory])
  

    const dummyHistoryFoodCount = [0,1,2,3,4,5]
  return (
    <View className='px-5 mt-10'>
      <View className='flex-row items-center justify-between'>
      <Text style={{color: theme.text}} className='text-xl'>Meal History</Text>
      <Text style={{color: theme.accentColor}} className=' text-base'>Show More</Text>
      </View>

        {mealHistory?.map((foodHistory: any) => (
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
    </View>
  )
}

export default CaloriesHistory