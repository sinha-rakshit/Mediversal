import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../pages/loginMobile";
import SignupEmail from "../pages/signupEmail";
import HomeScreen from "../pages/HomeScreen";
import SuccessAnimation from "../pages/SuccessAnimation";

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