import { View, Text } from 'react-native'
import React from 'react'
import CaloriesIntake from './CaloriesIntake'
import { CommonThemeProp } from '../utils/commonProps'



const MainCarousel: React.FC<CommonThemeProp> = ({theme}) => {
  return (
    <View className='px-5 mt-5'>
        <Text style={{color: theme.text}} className=' text-2xl'>Today</Text>
      <CaloriesIntake theme={theme} />
    </View>
  )
}

export default MainCarousel