import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CommonThemeProp, NavigationProps } from '../utils/commonProps'
import HorizontalProgress from './HorizontalProgress'
import CustomText from './CustomText'
import { Icon } from '@rneui/base'
import { UserMealsProp } from '../utils/types'

interface ComponentProps {
  meals: UserMealsProp
}

const CaloriesBreakdown: React.FC<CommonThemeProp & ComponentProps & NavigationProps> = ({theme, meals, navigation}) => {
  const {breakfast, lunch, dinner} = meals
  return (
    <View className='px-5 mt-10'>
      <Text className='text-xl' style={{color: theme.text}}>Meals Breakdown</Text>

        <TouchableOpacity onPress={() => navigation.navigate('mealDetails', {
          meal: 'Breakfast'
        })} style={{backgroundColor: theme.background2}} className='mt-3 rounded-lg p-3 flex-row justify-between items-center'>
          <View>
          <CustomText className='font-bold text-lg'>Breakfast</CustomText>
          <View className='flex-row gap-x-5 mt-3'>
            <CustomText>Kcal: {breakfast.calories}</CustomText>
            <CustomText>P: {breakfast.macros.protien}g</CustomText>
            <CustomText>C: {breakfast.macros.carbohydrate}g</CustomText>
            <CustomText>F: {breakfast.macros.fat}g</CustomText>
          </View>
          </View>

          <TouchableOpacity style={{backgroundColor: theme.accentColor}} className=' w-10 h-10 justify-center items-center rounded-full'>
            <Icon name='add' type='ionicons' color={'white'} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('mealDetails', {
          meal: 'Lunch'
        })} style={{backgroundColor: theme.background2}} className='mt-3 rounded-lg p-3 flex-row justify-between items-center'>
          <View>
          <CustomText className='font-bold text-lg'>Lunch</CustomText>
          <View className='flex-row gap-x-5 mt-3'>
            <CustomText>Kcal: {lunch.calories}</CustomText>
            <CustomText>P: {lunch.macros.protien}g</CustomText>
            <CustomText>C: {lunch.macros.carbohydrate}g</CustomText>
            <CustomText>F: {lunch.macros.fat}g</CustomText>
          </View>
          </View>

          <TouchableOpacity style={{backgroundColor: theme.accentColor}} className=' w-10 h-10 justify-center items-center rounded-full'>
            <Icon name='add' type='ionicons' color={'white'} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('mealDetails', {
          meal: 'Dinner'
        })} style={{backgroundColor: theme.background2}} className='mt-3 rounded-lg p-3 flex-row justify-between items-center'>
          <View>
          <CustomText className='font-bold text-lg'>Dinner</CustomText>
          <View className='flex-row gap-x-5 mt-3'>
            <CustomText>Kcal: {dinner.calories}</CustomText>
            <CustomText>P: {dinner.macros.protien}g</CustomText>
            <CustomText>C: {dinner.macros.carbohydrate}g</CustomText>
            <CustomText>F: {dinner.macros.fat}g</CustomText>
          </View>
          </View>

          <TouchableOpacity style={{backgroundColor: theme.accentColor}} className=' w-10 h-10 justify-center items-center rounded-full'>
            <Icon name='add' type='ionicons' color={'white'} />
          </TouchableOpacity>
        </TouchableOpacity>

    </View>
  )
}

export default CaloriesBreakdown