import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../features/Home/';

export default function Homestack() {
  const Homestack = createNativeStackNavigator();

  return (
    <Homestack.Navigator
      screenOptions={{animation: 'slide_from_right', headerShown: false}}
      initialRouteName="Home">
      <Homestack.Screen name="Home" component={Home} />
    </Homestack.Navigator>
  );
}
