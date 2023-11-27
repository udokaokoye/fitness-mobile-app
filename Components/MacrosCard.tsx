import { View, Text } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import ProgressSlider from './ProgressSlider'
import { CommonThemeProp } from '../utils/commonProps'

interface ComponentProp {
    title: string
    value: number
    total: number
}

const MacrosCard: React.FC<ComponentProp & CommonThemeProp> = ({title, value, total, theme}) => {

  const calculateSliderPercentage = (current: number, total:number): number => {
    const returnValue = (current/total) * 100

    return returnValue;
  }
  return (
    <View className=' justify-center items-center'>
      <CustomText className='text-base capitalize'>{title}</CustomText>
        <ProgressSlider
        theme={theme}
        value={calculateSliderPercentage(value, total)}
        />
      <CustomText className='font-bold'>{value} / {total}g</CustomText>
    </View>
  )
}

export default MacrosCard