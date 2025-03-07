import React, { useState } from "react";
import { View, TextInput, Alert, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import CountryPickerComponent from "./CountryPicker";
import OTPModalMobile from "./OTPModalMobile"; 
import { IP_ADDR } from "@env";
import { theme } from "../assets/theme";

// ✅ Styled Components
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const MobileInput = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: ["91"], // Default to India
  });
  const [isOTPModalVisible, setOTPModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  // ✅ Handle input change with validation
  const handleMobileInputChange = (text) => {
    const sanitizedText = text.replace(/\D/g, ""); 
    if (sanitizedText.length <= 10) {
      setMobileNumber(sanitizedText);
    } else {
      Alert.alert("Invalid Input", "Mobile number cannot exceed 10 digits.");
    }
  };

  // ✅ Function to send OTP request to the server
  const sendOTP = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.");
      return;
    }
  
    setLoading(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); 
  
    try {
      const response = (await Promise.race([
        fetch(`http://13.201.98.12:4000/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: mobileNumber, auth_method:"phone"}),
          signal: controller.signal,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), 10000)),
      ])) as Response;
  
      clearTimeout(timeoutId);
      setLoading(false);
  
      if (!response.ok) {
        const data = await response.json();
        Alert.alert("Error", data.message || "Failed to send OTP. Try again.");
        return;
      }
      setOTPModalVisible(true);
  
    } catch (error) {
      
      setLoading(false);
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.message === "Request Timeout") {
        Alert.alert("Timeout", "The request took too long. Please try again.");
      } else if (error.name === "AbortError") {
        Alert.alert("Timeout", "The request was aborted due to slow response.");
      } else {
        Alert.alert("Network Error", "Unable to connect to the server. Try again later.");
      }
    }
  };
  


  return (
    <StyledView className="flex-col items-center w-full mt-2">
      <StyledView className="flex-row items-center w-full space-x-3">
        {/* ✅ Country Code Box */}
        <StyledView className="p-3 bg-[#f8f8f8] border border-gray-300 rounded-xl">
          <CountryPickerComponent onSelectCountry={setSelectedCountry} />
        </StyledView>

        {/* ✅ Mobile Number Input Box */}
        <StyledView
        className={`flex-auto p-1 bg-[#f8f8f8] border ${
          isMobileFocused ? "border-[#0088b1]" : "border-gray-300"
        } rounded-xl min-h-[50px]`}
      >
        <StyledTextInput
          className={`w-full text-base placeholder-[#b3b3b3] font-regular pl-3 ${theme.colors.black}`}
          placeholder="98765-43210"
          keyboardType="numeric"
          value={mobileNumber}
          onChangeText={handleMobileInputChange}
          maxLength={10}
          placeholderTextColor="#b3b3b3"
          onFocus={() => setIsMobileFocused(true)}
          onBlur={() => setIsMobileFocused(false)}
        />
      </StyledView>
      </StyledView>

      {/* ✅ OTP Button */}
      <StyledTouchableOpacity
        className="bg-[#0088B1] p-4 rounded-xl items-center mt-6 w-full "
        onPress={sendOTP} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <StyledText className={`text-lg font-medium text-center ${theme.colors.white}`}>
            Send the OTP
          </StyledText>
        )}
      </StyledTouchableOpacity>

      {/* ✅ OTP Modal */}
      {isOTPModalVisible && (
        <OTPModalMobile
        isVisible={isOTPModalVisible}
        onClose={() => setOTPModalVisible(false)}
        phoneNumber={`${mobileNumber}`}
        onGoBack={() => {
          console.log("Go Back Pressed");
        }}
      />      
      )}
    </StyledView>
  );
};

export default MobileInput;
