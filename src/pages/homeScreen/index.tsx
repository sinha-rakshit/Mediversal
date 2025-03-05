import React, { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import HomeScreen from "."; // Import your HomeScreen component

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <SplashScreen /> : <HomeScreen />;
}
