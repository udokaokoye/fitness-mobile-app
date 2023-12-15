import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../Store/AuthContext'
import { Icon } from '@rneui/base';

const Profile = () => {
    const user = useContext(AuthContext)?.user;
    return (
        <SafeAreaView className='bg-gray-200' style={{ flex: 1 }}>

            <ScrollView >
                <View style={{ height: 30 }} className=''>
                    <View className=' flex-row justify-between mx-8 mt-2'>
                        <Icon name='arrow-back-ios' />
                        <Icon name='more-vertical' type='feather' />
                    </View>
                </View>
                <View style={{ minHeight: 300, marginBottom: 20 }} >

                    <View style={{ width: 120, height: 120, }}
                        className=" rounded-full overflow-hidden mx-auto mt-10">
                        {user?.avatar ? (
                            // <Image source={{ uri: user?.avatar }} style={{ width: 100, height: 100 }} />
                            <Text>User Image Here</Text>
                        ) : (
                            <Image style={{ width: 120, height: 120 }} source={{ uri: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg' }} />

                        )}
                    </View>
                    <Text className='text-3xl text-center mt-5'>{user?.firstName} {user?.lastName}</Text>
                    <Text className='text-center mt-2'>@leviokoye</Text>
                    <TouchableOpacity className='border border-gray-400 rounded-xl px-5 py-2 mt-5 mx-auto' style={{ width: 200, height: 50 }}>
                        <Text className='m-auto font-bold '>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className=' bg-white px-5 pt-8' style={{ minHeight: 600, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                    <SettingsMenuComponent menuTitle='Settings' menuIcon='settings' iconType='feather' />
                    <SettingsMenuComponent menuTitle='Update Goals' menuIcon='fitness-outline' iconType='ionicon' />
                    <SettingsMenuComponent menuTitle='Settings' menuIcon='settings' iconType='feather' />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

interface SettingsMenuProps {
    menuTitle: string,
    menuIcon: string,
    iconType: string,
}

export const SettingsMenuComponent: React.FC<SettingsMenuProps> = ({menuTitle,menuIcon, iconType}) => (
    <View className='p-2 flex-row items-center mb-3'>
        <View style={{ width: 50, height: 50 }} className='bg-gray-200 justify-center items-center rounded-xl'>
            <Icon name={menuIcon} type={iconType} />
        </View>
        <Text className='ml-5 font-bold' style={{ fontSize: 18 }}>{menuTitle}</Text>
        <View className=' ml-auto'>
            <Icon name='chevron-thin-right' type='entypo' size={20} />
        </View>
    </View>
)