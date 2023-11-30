import { View, Text,SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../Store/ThemeContext';
import { blackTheme } from '../Store/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProps } from '../utils/commonProps';
import { AuthContext } from '../Store/AuthContext';

const Login: React.FC<NavigationProps> = ({navigation}) => {
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('');
  const [error, seterror] = useState(null);
  const authContext = useContext(AuthContext)

  const ipAddress = "192.168.1.167";
  const loginHandler = async () => {
    const formData = new FormData()

    if(email == '' || password == '') {
      alert('please enter email and password')
      return
    }

    formData.append('email', email)
    formData.append('password', password);
    try {
      const res = await fetch(`http://${ipAddress}/fitness-backend/api/auth/login.php`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json();
    // console.log(data);

    if (data.status !== 200) {
      seterror(data.message)
      return
    } else {

      await AsyncStorage.setItem('user', JSON.stringify(data.data))
      authContext?.setisLoggedIn(true)
    }

    

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <SafeAreaView className='flex-1 '>
      {/* <Text>Login</Text> */}

      <View className='mt-20'>

        <Text className='text-2xl font-bold text-center mb-5'>Fitness App</Text>

        {error && <Text className='text-center mb-5 text-red-500 font-bold'>{error}</Text>}

        <TextInput  keyboardType="email-address" autoCapitalize='none' onChangeText={(txt) => setemail(txt)}  placeholder='Email' className='bg-gray-200 border-2 border-gray-300 rounded-lg self-center p-5' style={{width: '80%', height: 60}} />
        <TextInput autoCapitalize='none' onChangeText={(txt) => setpassword(txt)} secureTextEntry placeholder='Password' className='mt-5 bg-gray-200 border-2 border-gray-300 rounded-lg self-center p-5' style={{width: '80%', height: 60}} />
        {/* <TextInput placeholder='password'  /> */}

        <TouchableOpacity onPress={() => loginHandler()} className=' mt-5 self-center rounded-xl justify-center items-center' style={{backgroundColor: theme.accentColor, width :'80%', height: 60}}>
            <Text className='text-lg text-white font-bold'>Login</Text>
        </TouchableOpacity>

        <View className='flex-row justify-between self-center mt-5' style={{width: '80%'}}>
        <TouchableOpacity className=''>
            <Text>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity className=''>
            <Text>forgot password?</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login