import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../Store/AuthContext'

const Profile = () => {
    const user = useContext(AuthContext)?.user;
    return (
        <SafeAreaView className='bg-gray-200' style={{ flex: 1 }}>

            <ScrollView >
                <View style={{ minHeight: 300, marginBottom: 20 }} >

                    <View  style={{ width: 120, height: 120, }}
                        className=" rounded-full overflow-hidden mx-auto mt-10">
                        {user?.avatar ? (
                            // <Image source={{ uri: user?.avatar }} style={{ width: 100, height: 100 }} />
                            <Text>User Image Here</Text>
                        ) : (
                            <Image style={{ width: 120, height: 120 }} source={{uri: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}} />

                        )}
                    </View>
                    <Text className='text-3xl text-center mt-5'>{user?.firstName} {user?.lastName}</Text>
                    <Text className='text-center mt-2'>@leviokoye</Text>
                    <TouchableOpacity className='bg-blue-500 rounded-xl px-5 py-2 mt-5 mx-auto' style={{ width: 200, height: 50 }}>
                            <Text className='m-auto font-bold '>Edit Profile</Text>
                        </TouchableOpacity>
                </View>

                <View className=' bg-white' style={{minHeight: 600, borderTopLeftRadius: 80, borderTopRightRadius: 80}}>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile