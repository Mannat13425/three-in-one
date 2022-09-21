import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./home-screen";
import { FormScreen } from "./from-screen";
import { LoginScreen } from "./Login-screen";
const Stack = createStackNavigator();

export const Routes = (props) => {
  return (
    <React.Fragment>
      <NavigationContainer>
        <Stack.Navigator style={{ display: 'flex' }}>
        <Stack.Screen 
            name="LoginScreen" 
          >{props => <LoginScreen {...props} />}</Stack.Screen>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen 
            name="FormScreen" 
            component={FormScreen}
          />
           
        </Stack.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
};