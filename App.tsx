import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Screens/Home";
import { useEffect, useState, useContext } from "react";
import { blackTheme, lightTheme } from "./Store/themes";
import { ThemeContext } from "./Store/ThemeContext";
import Discover from "./Screens/Discover";
import { Icon } from "@rneui/themed";
import Fasting from "./Screens/Fasting";
import SearchFood from "./Screens/SearchFood";
import HomeStack from "./Stacks/HomeStack";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthContext, UserInfoProps } from "./Store/AuthContext";
import { isUserLoggedIn } from "./utils/lib";
import AuthStack from "./Stacks/AuthStack";
import { MealHistoryProps, MealsHistoryContext } from "./Store/MealsHistoryContext";
import { logMeal } from "./redux/reducers/caloriesSlice";
import { logBreakfast, logDinner, logLunch } from "./redux/reducers/mealsSlice";
import { UserMealsProp } from "./utils/types";
import moment from "moment";
import Profile from "./Screens/Profile";
import ProfileStack from "./Stacks/ProfileStack";
const Stack = createNativeStackNavigator();

export default function App() {
  const Tab = createBottomTabNavigator();

  const [theme, setTheme] = useState(lightTheme);
  const [loading, setloading] = useState(false)
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [user, setuser] = useState<UserInfoProps | null>(null)
  const [mealHistory, setmealHistory] = useState(null)
  // const user = useContext(AuthContext)?.user;

  useEffect(() => {
    async function getUserTheme () {
      const theme = await AsyncStorage.getItem('theme')
      console.log(theme)
      if (theme) {
        setTheme(JSON.parse(theme))
      } else {
        setTheme(lightTheme)
      }
    }
    setloading(true)
    async function validateUser() {
      const userLoggedIn = await isUserLoggedIn();
      if (userLoggedIn) {
        setuser(JSON.parse(userLoggedIn));
        setloading(false)
        setisLoggedIn(true)
      } else {
        setloading(false)
        setisLoggedIn(false)
      }
    }
    getUserTheme()
    validateUser()
  }, [])

  



  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <AuthContext.Provider value={{ isLoggedIn, setisLoggedIn, user, setuser }}>
          <MealsHistoryContext.Provider value={{mealHistory, setmealHistory}}>

            {/* <Text>Hello</Text> */}
            <NavigationContainer>

              {isLoggedIn ? (
                <Tab.Navigator screenOptions={{
                  tabBarStyle: {
                    backgroundColor: theme.lighterBackground,
                    borderColor: 'transparent'
                  }
                }}>
                  <Tab.Screen
                    name="HomeTab"
                    component={HomeStack}
                    options={{
                      headerShown: false,
                      tabBarLabel: () => (
                        <Text style={{ color: theme.text }}>Home</Text>
                      ),
                      tabBarIcon: () => (
                        <Icon name="home" type="feather" color={theme.text} />
                      )
                    }}
                  />
                  <Tab.Screen
                    name="Fast"
                    component={Fasting}
                    options={{
                      headerShown: false,
                      tabBarLabel: () => (
                        <Text style={{ color: theme.text }}>Fasting</Text>
                      ),
                      tabBarIcon: () => (
                        <Icon name="stopwatch-outline" type="ionicon" color={theme.text} />
                      )
                    }}
                  />

                  <Tab.Screen
                    name="Discover"
                    component={Discover}
                    options={{
                      headerShown: false,
                      tabBarLabel: () => (
                        <Text style={{ color: theme.text }}>Discover</Text>
                      ),
                      tabBarIcon: () => (
                        <Icon name="search" type="evilicon" color={theme.text} />
                      )
                    }}
                  />
                  <Tab.Screen
                    name="profileTab"
                    component={ProfileStack}
                    options={{
                      headerShown: false,
                      tabBarLabel: () => (
                        <Text style={{ color: theme.text }}>Me</Text>
                      ),
                      tabBarIcon: () => (
                        <Icon name="user" type="evilicon" color={theme.text} />
                      )
                    }}
                  />
                </Tab.Navigator>
              ) : (<AuthStack />)}
            </NavigationContainer>
          </MealsHistoryContext.Provider>

        </AuthContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  );
}
