import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Icon } from '@rneui/base'
import { CommonThemeProp } from '../../utils/commonProps'
import { Theme, blackTheme } from '../../Store/themes'
import { ThemeContext, ThemeContextType } from '../../Store/ThemeContext'
import RBSheet from 'react-native-raw-bottom-sheet'
import { AuthContext } from '../../Store/AuthContext'
import { heightData, updateUserAsyncStorage } from '../../utils/lib'
import { Picker } from '@react-native-picker/picker'
import { API_URL } from '@env'
import { set } from 'lodash'
import { auth } from '../../firebase'
import { parse } from 'react-native-redash'

const HealthFithnessSettings: React.FC<CommonThemeProp> = () => {


  const themeContext = useContext(ThemeContext) || { theme: blackTheme };
  const [activeHealthMenuValue, setactiveHealthMenuValue] = useState<string>()
  const theme = themeContext.theme;
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const refRBSheet = useRef<any>();
  // useEffect(() => {
  //   console.log(user)
  // }, [])

  const [newHeight, setnewHeight] = useState<string | unknown>('')
  const [newWeight, setnewWeight] = useState('')
  const [newGoalWeight, setnewGoalWeight] = useState('')
  const [newCalories, setnewCalories] = useState('')

  const [valueToUpdate, setvalueToUpdate] = useState<string | null>()

  const [activeHealthMenu, setactiveHealthMenu] = useState<null | string>()

  const updateHealthInfo = async () => {
    let fieldToUpdate = ''
    switch (activeHealthMenu) {
      case 'height':
        fieldToUpdate = 'height'
        break;

      case 'weight':
        fieldToUpdate = 'weight'
        break;

      case 'goal_weight':
        fieldToUpdate = 'goal_weight'
        break;

      case 'calories':
        fieldToUpdate = 'daily_calories'
        break;

      default:
        break;
    }
    const formData = new FormData()
    formData.append('id', user?.id.toString() || '')
    formData.append('field', fieldToUpdate)
    if (fieldToUpdate == 'height') {
      formData.append('value', newHeight ? newHeight.toString() : '')
    } else {
      formData.append('value', valueToUpdate ? valueToUpdate : '')
    }
    formData.append('id', user?.id.toString() || '')

    try {
      const res = await fetch(`http://${API_URL}/fitness-backend/api/user/updateSingle.php`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      console.log(data)
      if (data.status !== 200) {
        alert(data.message)
        return
      } else {
        if (user) {
          if (fieldToUpdate == 'height') {
            user['height'] = parseInt(newHeight ? newHeight.toString() : '0');
          } else {
            user[fieldToUpdate] = valueToUpdate;
          }
          updateUserAsyncStorage(user)
          authContext?.setuser((prev) => ({ ...prev, ...user }))
        }
        alert(data.message)
        refRBSheet.current.close()
      }
    } catch (error) {

    }

  }

  return (
    <SafeAreaView>
      <View style={{ height: 30, position: 'relative' }} className=' mx-8 flex-row justify-center items-center'>

        <TouchableOpacity>
          <Icon color={theme?.text} name='arrow-back-ios' />
        </TouchableOpacity>

        <Text style={{ width: '100%' }} className='text-lg font-bold text-center'>Health & Fitness</Text>

      </View>
      <ScrollView>

        <View className='mx-5 mt-5'>
          <HealthFitnessMenu onClick={() => {
            setvalueToUpdate(user?.height.toString())
            setactiveHealthMenu('height')
            setactiveHealthMenuValue(user?.height.toString())
            refRBSheet.current.open()

          }} theme={theme}
            title='height'
            value={heightData.filter((hData) => parseInt(hData.CM) == user?.height)[0].Foot}
          />

          <HealthFitnessMenu onClick={() => {
            setvalueToUpdate(user?.weight.toString())
            setactiveHealthMenu('weight')
            setactiveHealthMenuValue(user?.weight.toString())

            refRBSheet.current.open()
          }} theme={theme}
            title='weight'
            value={user?.weight.toString() + 'lb'}

          />


          <HealthFitnessMenu onClick={() => {
            setvalueToUpdate(user?.goal_weight.toString())
            setactiveHealthMenu('goal_weight')
            setactiveHealthMenuValue(user?.goal_weight.toString())

            refRBSheet.current.open()
          }} theme={theme}
            title='Goal Weight'
            value={user?.goal_weight.toString() + 'lb'}

          />

          <HealthFitnessMenu onClick={() => {
            setvalueToUpdate(user?.daily_calories.toString())
            setactiveHealthMenu('calories')
            setactiveHealthMenuValue(user?.daily_calories.toString())

            refRBSheet.current.open()
          }} theme={theme}
            title='Daily Calories Intake'
            value={user?.daily_calories.toString() + ' Kcal'}

          />


        </View>
      </ScrollView>
      {/* @ts-ignore */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get("screen").height / 1.5}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
            // height: 500
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >

        <View className='mx-5'>
          <Text className='text-lg text-center font-bold capitalize '>Update {activeHealthMenu}</Text>

          {activeHealthMenu == 'height' ? (
            <View style={{ width: "100%" }}>
              <Picker
                selectedValue={newHeight}
                onValueChange={(itemValue, itemIndex) => {
                  //  set(itemValue);
                  setnewHeight(itemValue)
                }}
              // style={{backgroundColor: '#ececec', borderRadius: 30}}
              >
                {heightData.map((heightInfo) => (
                  <Picker.Item
                    color={theme.text}
                    key={heightInfo.CM}
                    label={`${heightInfo.Foot} ( ${heightInfo.CM}CM)`}
                    value={heightInfo.CM}
                  />
                ))}
              </Picker>
              <Text className="text-lg text-center mb-2 font-bold">
                Height (FT/CM)
              </Text>
            </View>) : (
            <View style={{ width: '90%' }} className='flex-row self-center items-center justify-between mb-5 '>
              <TextInput onChangeText={(txt) => setvalueToUpdate(txt)} value={valueToUpdate ? valueToUpdate : ''} placeholderTextColor={theme.text} placeholder='Enter Height' style={{ width: '89%', height: 50, backgroundColor: theme.background2 }} className=' rounded-xl px-5' />
              <View style={{ backgroundColor: theme.background2, width: '10%' }} className=' rounded-full'>
                <Text className='text-center'>lb</Text>
              </View>
            </View>
          )}



          <Button onPress={() => updateHealthInfo()} style={{ borderRadius: 50 }}>Update</Button>
        </View>

      </RBSheet>
    </SafeAreaView>
  )
}

export default HealthFithnessSettings

interface HealthFitnessMenuProps {
  theme: Theme
  onClick?: () => void
  title: string
  value: string
  // updateTitle: string
}
const HealthFitnessMenu: React.FC<HealthFitnessMenuProps> = ({ theme, onClick, title, value }) => {
  return (
    <TouchableOpacity onPress={() => onClick ? onClick() : console.log(null)} style={{ backgroundColor: theme.background }} className='mb-5 px-3 py-2  rounded-xl flex-row items-center justify-between'>
      <Text className='text-lg'>{title}</Text>

      <View className='flex-row items-center'>
        <Text className='text-lg'>{value}</Text>
        <Icon name='chevron-right' />
      </View>
    </TouchableOpacity>
  )
}