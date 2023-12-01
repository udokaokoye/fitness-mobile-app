import { View, Text, SafeAreaView, ImageBackground } from 'react-native'
import React, { useContext } from 'react'
import { Button } from '@rneui/base'
import { AuthContext, AuthContextType } from '../Store/AuthContext'
import { logDinner } from '../redux/reducers/mealsSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native'
import { ThemeContext } from '../Store/ThemeContext'
import { blackTheme } from '../Store/themes'
import { NavigationProps } from '../utils/commonProps'

const Auth: React.FC<NavigationProps> = ({ navigation }) => {
    const themeContext = useContext(ThemeContext) || { theme: blackTheme };
    const theme = themeContext.theme;
    const authContext = useContext(AuthContext)
    const imageOption = ['https://images.unsplash.com/photo-1567159644489-23dad666da5c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']

    async function login() {
        await AsyncStorage.setItem('authToken', 'demo')
        authContext?.setisLoggedIn(true)
    }
    return (

        <React.Fragment>
            <ImageBackground style={{ flex: 1 }} width={500} height={500} resizeMode='cover' source={{ uri: imageOption[0] }}>
                <LinearGradient
                    className=' absolute bottom-0'
                    colors={['#ffffff00', '#fff', '#fff']}
                    style={{ width: '100%', height: 600 }}
                >
                    <View style={{ top: 280, width: '100%' }} className=' bottom-0 absolute'>
                        <Text className=' text-3xl font-bold text-center'>Fitness App</Text>
                        <Text className=' text-center mt-5 font-bold text-base text-gray-400'>Take the next step toward a healthier, more active life</Text>

                        <TouchableOpacity className='bg-blue-300 rounded-3xl justify-center self-center mt-5 items-center' style={{ backgroundColor: theme.accentColor, width: '70%', height: 60 }}>
                            <Text className='text-lg font-bold' style={{ color: 'white' }}>Sign in with Google</Text>
                        </TouchableOpacity>

                        <View className=' flex-row gap-x-3 items-center justify-center'>
                            <TouchableOpacity onPress={() => navigation.navigate('login')} className='self-center mt-5'>
                                <Text className='font-bold text-lg'>Sign In</Text>
                            </TouchableOpacity>
                            <Text>or</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('signup')} className='self-center mt-5'>
                                <Text className='font-bold text-lg'>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </React.Fragment>
    )
}

export default Auth