import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomText from '../Components/CustomText'
import { Icon } from '@rneui/base'
import { ThemeContext } from '../Store/ThemeContext'
import { NavigationProps } from '../utils/commonProps'

const Help:React.FC<NavigationProps> = ({navigation}) => {
    const themeContext = useContext(ThemeContext)
    const theme = themeContext?.theme
    return (
        <SafeAreaView className='p-3 flex-1' >
            <View className='flex-row justify-between' style={{paddingHorizontal: 5}}>
            <TouchableOpacity onPress={() => navigation.navigate('profile')}><Icon color={theme?.text} name='arrow-back-ios' /></TouchableOpacity>

            <Text className='text-xl text-center font-bold'>Help</Text>
            <View className='w-2 h-5'></View>
            </View>
            <ScrollView >
                <CustomText className='text-2xl font-bold mt-5'>Welcome to the Help Center</CustomText>
                <CustomText>View frequently asked questions</CustomText>

                <View>
                    <CustomText className='text-xl font-bold mt-10 underline'>FAQ</CustomText>

                    <View className='mt-3'>
                        <Text>No FAQ at this time.</Text>
                    </View>
                </View>

                
            </ScrollView>

            <View className='h-10' style={{marginTop: 'auto'}}>
                    <Text className='text-center'>Having troubles? email <Text className=' font-bold'>leviokoye@gmail.com</Text>.</Text>
                </View>


        </SafeAreaView>
    )
}

export default Help