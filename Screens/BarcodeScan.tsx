import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Icon } from "@rneui/base";
import { NavigationProps } from "../utils/commonProps";
import { ThemeContext } from "../Store/ThemeContext";
import { blackTheme } from "../Store/themes";
import { AutoFocus, Camera, CameraType, FlashMode } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getUsersAccessToken, searchFoodWithBarcode } from "../utils/lib";
import { TouchableNativeFeedback } from "react-native";
const BarcodeScan: React.FC<NavigationProps> = ({ navigation }) => {
  const [accessToken, setaccessToken] = useState("");
  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const theme = themeContext.theme;
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setflashOn] = useState(false)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getUsersAccessToken();
      setaccessToken(token);
    };
    fetchToken();
  }, []);

  const handleBarCodeScanned = async (args: any) => {
    setScanned(true);
    setflashOn(false)
    const foodId = await searchFoodWithBarcode(accessToken, args.data);
    if (foodId == null) {
      alert("Food Not Found")
      return
    }
    navigation.navigate('foodDetails', {
      foodId: foodId
    })
  };


  if (hasPermission) {
    return (
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View className="flex-row items-center justify-between mx-5 pb-3">
          <Icon
            name="close"
            type="antdesign"
            color={theme.text}
            style={{ textAlign: "left" }}
            onPress={() => navigation.goBack()}
          />

          <Text className=" flex-1 text-center" style={{ color: theme.text }}>
            Scan Barcode
          </Text>
        </View>
        {/* <ScrollView className='flex-1' > */}

        <Text style={{ color: theme.text }} className=" text-center text-2xl">
          Scan Your Food
        </Text>

        <TouchableOpacity onPress={() => setflashOn(!flashOn)} style={{backgroundColor: flashOn ? theme.lighterBackground : theme.background2}} className="w-20 h-20 rounded-full justify-center items-center mx-auto mt-20">
            <Icon size={50} name="flash" type="entypo" color={theme.text} />
          </TouchableOpacity>



        <View
          className=" bg-black mx-auto justify-self-center mt-auto mb-auto rounded-3xl overflow-hidden relative"
          style={{ height: 400, width: "90%" }}
        >

          <Camera
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }}
            ratio='16:9'
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          flashMode={flashOn ? FlashMode.torch : FlashMode.off}
          autoFocus={AutoFocus.on}
          zoom={Platform.OS === 'ios' ? 0.015 : 0}
          // focusDepth={0}
          />
        </View>

        {scanned && (
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text className=" bg-red-500 px-20 py-5 text-3xl text-center font-bold text-white">Scan Again</Text>
          </TouchableOpacity>
        )}

        {/* </ScrollView> */}
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
        <View className="flex-row items-center justify-between mx-5 pb-3">
          <Icon
            name="close"
            type="antdesign"
            color={theme.text}
            style={{ textAlign: "left" }}
            onPress={() => navigation.goBack()}
          />

          <Text className=" flex-1 text-center" style={{ color: theme.text }}>
            Scan Barcode
          </Text>
        </View>

        <TouchableOpacity>
          <Text
            style={{ color: theme.text, borderWidth: 2, borderColor: "#ccc" }}
            className="text-center mt-20 text-2xl p-5 "
          >
            Grant Camera Access
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
};

export default BarcodeScan;
