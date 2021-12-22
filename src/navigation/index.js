import React from 'react';
import {StyleSheet} from 'react-native';
import CallingScreen from '../screens/CallingScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IncomingCallScreen from '../screens/IncomingCallScreen/index';
import {NavigationContainer} from '@react-navigation/native';
import CallScreen from '../screens/CallScreen';
import ContactScreen from '../screens/ContactScreen/index';
import LoginScreen from '../screens/LoginScreen';
const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Contacts" component={ContactScreen} />
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Call" component={CallScreen} />
          <Stack.Screen name="Calling" component={CallingScreen} />
          <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
