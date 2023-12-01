import { View, Text } from 'react-native'
import React from 'react'
import MacrosCard from './MacrosCard'
import { CommonThemeProp } from '../utils/commonProps'
import { UsersCaloriesProp } from '../utils/types'
interface ComponentProps {
  calories: UsersCaloriesProp
}
const MacrosInfo: React.FC<CommonThemeProp & ComponentProps> = ({theme, calories}) => {
  return (
    <View style={{backgroundColor: theme.background2}} className=" mx-5 mt-5 flex-row justify-evenly py-4 rounded-xl">
    <MacrosCard theme={theme} title="protien" value={calories.macros.protien.value} total={calories.macros.protien.goal} />
    <MacrosCard theme={theme} title="carbohydrate" value={calories.macros.carbohydrate.value} total={calories.macros.carbohydrate.goal} />
    <MacrosCard theme={theme} title="fat" value={calories.macros.fat.value} total={calories.macros.fat.goal} />
  </View>
  )
}

export default MacrosInfo