import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../Store/ThemeContext';
import { blackTheme } from '../Store/themes';
interface CustomTextProps {
    style?:any
}
const CustomText = (props:any) => {
    const themeContext = useContext(ThemeContext) || { theme: blackTheme };
    const theme = themeContext.theme;

    
    return <Text {...props} style={[{ color: theme.text }, props.style]}>{props.children}</Text>;

}

export default CustomText