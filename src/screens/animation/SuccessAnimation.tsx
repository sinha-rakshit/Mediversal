import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const SuccessAnimation: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Lottie Animation */}
      <LottieView
        source={require("../../assets/lottie/SuccessScreen.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      
      {/* Text Below Animation */}
      <Text style={styles.subtitle}>Password Updated</Text>
      <Text style={styles.successText}>Successfully</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  lottie: {
    width: 300, 
    height: 300, 
    marginBottom: 20, // Space between animation and text
  },
  subtitle: {
    fontSize: 16,
    color: "#7A7A7A",
    marginBottom: 2,
  },
  successText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BA7", // Dark blue matching the animation
  },
});

export default SuccessAnimation;