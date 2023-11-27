import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Icon } from '@rneui/base'
import { NavigationProps } from '../utils/commonProps'
import { ThemeContext } from '../Store/ThemeContext'
import { blackTheme } from '../Store/themes'
import { MealHistoryContextType, MealHistoryProps, MealsHistoryContext } from '../Store/MealsHistoryContext'
type ComponentProps= {
    route: any
}
const MealDetailsScreen: React.FC<ComponentProps & NavigationProps> = ({route, navigation}) => {
    const meal = route.params.meal
    const themeContext = useContext(ThemeContext) || { theme: blackTheme };
    const theme = themeContext.theme;
    const [mealHistory, setmealHistory] = useState([])

    let mealHistoryUnFIltered = useContext(MealsHistoryContext)?.mealHistory;

    useEffect(() => {
      if (meal == 'Breakfast') {
        setmealHistory(mealHistoryUnFIltered?.filter((foodHistory: MealHistoryProps) => foodHistory.meal == 'B'))
      }else if (meal == 'Lunch') {
        setmealHistory(mealHistoryUnFIltered?.filter((foodHistory: MealHistoryProps) => foodHistory.meal == 'L'))
      }else if (meal == 'Dinner') {
        setmealHistory(mealHistoryUnFIltered?.filter((foodHistory: MealHistoryProps) => foodHistory.meal == 'D'))
      } else {
        setmealHistory(mealHistoryUnFIltered)
      }
    }, [])
    
  return (
   <SafeAreaView>
            <View className="flex-row items-center justify-between mx-5 pb-3 mt-3">
          <Icon
            name="back"
            type="antdesign"
            color={theme.text}
            style={{ textAlign: "left" }}
            onPress={() => navigation.goBack()}
          />

          <Text className=" flex-1 text-center text-lg" style={{ color: theme.text }}>
            {meal}
          </Text>

          <Icon
            name="check"
            type="antdesign"
            color={theme.accentColor}
            style={{ opacity: 0 }}
          />
        </View>

        <ScrollView className='mx-5'>

            {
                mealHistory?.length == 0 && (
                    <View className=' items-center justify-center mt-10'>
                        <Text className='text-xl' style={{color: theme.text}}>No meals logged yet</Text>

                        {/* button to log meal */}
                        <TouchableOpacity onPress={() => navigation.navigate('searchFood')} style={{backgroundColor: theme.accentColor}} className='px-5 py-2 rounded-lg mt-5'>
                            <Text style={{color: 'white'}}>Log a meal</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {mealHistory?.map((foodHistory: MealHistoryProps) => (
                  <TouchableOpacity key={foodHistory.apiFoodID} style={{backgroundColor: theme.background2}} className=' flex-row  justify-between items-center mt-5 rounded-lg  p-3'>
                  <View className='flex-row gap-x-5'>
                  {/* <View className=' rounded-full items-center justify-center' style={{backgroundColor: theme.accentColor, width: 50, height: 50}}>
                   <Icon name='utensils' type='font-awesome-5' />
                   </View> */}
           
                   <View>
                       <Text className='text-lg' style={{color: theme.text}}>{foodHistory.name}</Text>
                       <Text className=' text-gray-300'>{foodHistory.calories} Cal</Text>
                   </View>
                  </View>
           
                   <View><Icon name='more-horizontal' type='feather' color={theme.text} /></View>
                 </TouchableOpacity>
        ))}
        </ScrollView>

   </SafeAreaView>
  )
}

export default MealDetailsScreen