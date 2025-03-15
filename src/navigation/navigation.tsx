import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupEmail from "../screens/auth/signupEmail";
import HomeScreen from "../screens/main/HomeScreen";
import SuccessAnimation from "../screens/animation/SuccessAnimation";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  HomeScreen: undefined;
  SuccessAnimation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupEmail} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SuccessAnimation" component={SuccessAnimation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;