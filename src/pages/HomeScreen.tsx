import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        {/* Insert your Lottie animation JSON file inside the source prop */}
        <LottieView 
          source={require('../assets/lottie/MainScene.json')} 
          autoPlay 
          loop 
          style={styles.lottieStyle}
        />
      </View>
      <Text style={styles.successText}>Welcome to HomeScreen!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  animationContainer: {
    width: 300,
    height: 300,
  },
  lottieStyle: {
    width: '100%',
    height: '100%',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BA7',
    marginTop: 20,
  },
});

export default HomeScreen;