
import { View, Dimensions, StyleSheet } from "react-native";
import React, { useRef, useEffect } from "react";
import LottieView from "lottie-react-native";


export default function SplashScreen() {
  const animationRef = useRef<LottieView | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  // Get screen dimensions
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        autoPlay
        loop
        style={{
          width: width,
          height: height,
        }}
        resizeMode="cover"
        source={require("../../assets/lottie/Mediversal Splash Screen - Test - 01.json")} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
