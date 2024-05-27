import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { Icon } from "@rneui/themed";
import { CommonThemeProp, NavigationProps } from "../utils/commonProps";
import CustomText from "./CustomText";
import moment from "moment";
import { AuthContext } from "../Store/AuthContext";
import { logUserOut } from "../utils/lib";


const HomeHeader: React.FC<CommonThemeProp & NavigationProps> = ({ theme, navigation }) => {

  const authContext = useContext(AuthContext)

  const user = authContext?.user;
  // useEffect(() => {
  //   console.log(user);
  // }, [])

  async function logout() {
    await logUserOut()
    authContext?.setisLoggedIn(false)
  }
  return (
    <View className="px-5 flex-row justify-between items-center">
      <TouchableOpacity onPress={() => navigation.navigate('profileTab')} className="flex-row gap-2">
        <View
          style={{ width: 50, height: 50 }}
          className=" rounded-full overflow-hidden"
        >

          <Image style={{ width: 50, height: 50 }} source={{ uri: user?.avatar ? user.avatar : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg' }} />
        </View>
        <View>
          <Text style={{ color: theme?.text }} className=" text-xl font-bold">Hello, {user?.firstName}</Text>
          <Text style={{ color: theme?.text }} className="text-xs">Good Morning</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={{ backgroundColor: theme.lighterBackground }} className=" justify-center items-center p-3 rounded-lg">
        {/* <Icon color={theme.text} name="notifications-outline" type="ionicon" /> */}
        <CustomText className='font-bold'>{moment().format('D')}</CustomText>
        <CustomText className='font-bold'>{moment().format('MMM')}</CustomText>
      </TouchableOpacity>
    </View>
  );
};


export default HomeHeader;
