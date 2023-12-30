import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../Store/AuthContext'
import { Icon, Switch } from '@rneui/base';
import { ThemeContext } from '../Store/ThemeContext';
import { Theme, blackTheme, lightTheme } from '../Store/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'lodash';
import { NavigationProps } from '../utils/commonProps';

const Profile: React.FC<NavigationProps> = ({navigation}) => {

    const [themeToggleValue, setthemeToggleValue] = useState(false)
    const user = useContext(AuthContext)?.user;
    const [showProfileMenu, setshowProfileMenu] = useState<boolean>(false)
    const themeContext = useContext(ThemeContext)
    const theme = themeContext?.theme

    useEffect(() => {
        async function checkUserThemeValue() {
            const currentTheme = JSON.parse(await AsyncStorage.getItem('theme') || '{}')

        if (currentTheme) {
            if (currentTheme?.background === '#FFFFFF') {
                setthemeToggleValue(false)
            } else {
                setthemeToggleValue(true)
            }
        }
        }

        checkUserThemeValue()
    }, [theme])
    

    const toggleDarkMode = async () => {
        // themeContext?.setTheme(blackTheme)
        const currentTheme = JSON.parse(await AsyncStorage.getItem('theme') || '{}')

        if (currentTheme) {
            if (currentTheme?.background === '#FFFFFF') {
                await AsyncStorage.setItem('theme', JSON.stringify(blackTheme))
                themeContext?.setTheme(blackTheme)
            } else {
                await AsyncStorage.setItem('theme', JSON.stringify(lightTheme))
                themeContext?.setTheme(lightTheme)
            }
        } else {
            await AsyncStorage.setItem('theme', JSON.stringify(blackTheme))
            themeContext?.setTheme(blackTheme)
        }
        // console.log(themeContext?.theme)
    }
    return (
        <SafeAreaView  style={{ flex: 1, backgroundColor: theme?.background2 }}>

            <ScrollView >
                <View style={{ height: 30, position: 'relative' }} className=''>
                    <View className=' flex-row justify-between mx-8 mt-2'>
                        <Icon color={theme?.text} name='arrow-back-ios' />
                        <TouchableOpacity className=' flex-row w-20 ' onPress={() => setshowProfileMenu(!showProfileMenu)}>
                        <Icon color={theme?.text} style={{marginLeft: 60}} name='more-vertical' type='feather' />
                        </TouchableOpacity>
                    </View>

                    {showProfileMenu && (
                        <View style={{
                            width: 150, maxHeight: 200, right: 50, top: 60, zIndex: 2, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.27,
                            shadowRadius: 4.65,

                            elevation: 6
                        }} className='bg-gray-200 absolute'>
                            <SettingsMenuComponent theme={theme} menuTitle='Help ?' menuIcon='help-circle' iconType='feather' withArrowRight={false} />
                            <SettingsMenuComponent theme={theme} menuTitle='Logout' menuIcon='exit-outline' iconType='ionicon' withArrowRight={false} />
                        </View>
                    )}
                </View>
                <View style={{ minHeight: 300, marginBottom: 20, zIndex: -10 }} >

                    <View style={{ width: 120, height: 120, }}
                        className=" rounded-full overflow-hidden mx-auto mt-10">
                        {user?.avatar ? (
                            // <Image source={{ uri: user?.avatar }} style={{ width: 100, height: 100 }} />
                            <Text>User Image Here</Text>
                        ) : (
                            <Image style={{ width: 120, height: 120 }} source={{ uri: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg' }} />

                        )}
                    </View>
                    <Text style={{color: theme?.text}} className='text-3xl text-center mt-5'>{user?.firstName} {user?.lastName}</Text>
                    <Text style={{color: theme?.text}} className='text-center mt-2'>@leviokoye</Text>
                    <TouchableOpacity className='border border-gray-400 rounded-xl px-5 py-2 mt-5 mx-auto' style={{ width: 200, height: 50 }}>
                        <Text style={{color: theme?.accentColor}} className='m-auto font-bold '>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className=' px-5 pt-6' style={{ minHeight: 600, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: theme?.background }}>
                    {/* <Text className='ml-3 mb-5 text-lg font-bold'>Menu</Text> */}
                    <SettingsMenuComponent theme={theme} menuTitle='Dark Mode' menuIcon='moon' iconType='feather' withArrowRight={false} darkmode themeToggleValue={themeToggleValue} onclick={toggleDarkMode} />
                    <SettingsMenuComponent theme={theme} menuTitle='Settings' menuIcon='settings' iconType='feather' />
                    <SettingsMenuComponent onclick={() => navigation.navigate('healthFitnessSettings')} theme={theme} menuTitle='Health & Fitness' menuIcon='fitness-outline' iconType='ionicon' />
                    <SettingsMenuComponent theme={theme} menuTitle='Help?' menuIcon='help-circle' iconType='feather' />
                    <SettingsMenuComponent theme={theme} menuTitle='Logout' menuIcon='exit-outline' iconType='ionicon' />
                    <Text className='text-gray-500 text-lg text-center mt-auto mb-56'>@Fitness App v1.00</Text>
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
    withArrowRight?: boolean,
    darkmode?: boolean,
    themeToggleValue?: boolean,
    theme: Theme | undefined,
    onclick?: () => void
}

export const SettingsMenuComponent: React.FC<SettingsMenuProps> = ({ menuTitle, menuIcon, iconType, withArrowRight = true, darkmode=false, themeToggleValue, onclick, theme }) => (
    <TouchableOpacity className='p-2 flex-row items-center mb-3' onPress={() => onclick ? onclick() : console.log(null)}>
        <View style={{ width: 40, height: 40 }} className='bg-gray-200 justify-center items-center rounded-xl'>
            <Icon name={menuIcon} type={iconType} size={18} />
        </View>
        <Text className='ml-5 font-bold' style={{ fontSize: 15, color: theme?.text }}>{menuTitle}</Text>
        {withArrowRight && (<View className=' ml-auto'>
            <Icon name='chevron-thin-right' type='entypo' size={15} color={theme?.text} />
        </View>)}

        {darkmode && (
            <View className=' ml-auto'>
                <Switch onChange={() => onclick ? onclick() : console.log(null)} value={themeToggleValue} />
            </View>
        )}
    </TouchableOpacity>
)