import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login} from './view/login';
import Main from './view/main';
import Register from './view/login/Register';

const Stack = createNativeStackNavigator();

class Navigation extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
          }}>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigation;
