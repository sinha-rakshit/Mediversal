import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import LoginScreen from "./src/pages/loginMobile";
import SplashScreen from "./src/pages/homeScreen/SplashScreen";
import { setCustomText } from "react-native-global-props";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set default font globally
    const customTextProps = {
      style: {
        // fontFamily: "Plus Jakarta Sans",
        // fontFamily: "PlusJakartaSans-Regular",
        fontFamily: "Plus Jakarta Sans Medium",
        // fontFamily: "PlusJakartaSans-VariableFont_wght",

      },
    };
    setCustomText(customTextProps);

    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? <SplashScreen /> : <LoginScreen />}
    </SafeAreaView>
  );
};

export default App;
