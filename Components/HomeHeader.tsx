import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { Icon } from "@rneui/themed";
import { CommonThemeProp } from "../utils/commonProps";
import CustomText from "./CustomText";
import moment from "moment";
import { AuthContext } from "../Store/AuthContext";
import { logUserOut } from "../utils/lib";


const HomeHeader: React.FC<CommonThemeProp> = ({ theme }) => {

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
      <View className="flex-row gap-2">
        <View
          style={{ width: 50, height: 50 }}
          className=" rounded-full overflow-hidden"
        >

          <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://avatars.githubusercontent.com/u/61575961?v=4' }} />
        </View>
        <View>
          <Text style={{ color: theme?.text }} className=" text-xl font-bold">Hello, {user?.firstName}</Text>
          <Text style={{ color: theme?.text }} className="text-xs">Good Morning</Text>
        </View>
      </View>

      <TouchableOpacity onPress={logout} style={{ backgroundColor: theme.lighterBackground }} className=" justify-center items-center p-3 rounded-lg">
        {/* <Icon color={theme.text} name="notifications-outline" type="ionicon" /> */}
        <CustomText className='font-bold'>{moment().format('D')}</CustomText>
        <CustomText className='font-bold'>{moment().format('MMM')}</CustomText>
      </TouchableOpacity>
    </View>
  );
};


export default HomeHeader;
