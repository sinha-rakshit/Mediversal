import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import { IP_ADDR } from "@env";

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  email: string;
  password: string;
}

const OTPModalEmail: React.FC<OTPModalProps> = ({ isVisible, onClose, email, password }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  // ✅ Handle OTP Input
  const handleOTPChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (value && index < 5) {
      // Move to next input if a digit is entered
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      // Move back if a digit is removed
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Handle OTP Submission
  const verifyOTP = async () => {
    const otpCode = otp.join(""); // Convert array to string
    if (otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${IP_ADDR}/api/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, password, auth_method:"email" }),
      });

      const data = await response.json();
      Alert.alert("Response", JSON.stringify(data, null, 2));
      
      if (response.ok) {
        Alert.alert("Success", data.message || "OTP Verified Successfully!");
        onClose(); 
      } else {
        Alert.alert("Error", data.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Failed to verify OTP. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}>
      <StyledView className="items-center p-5 bg-white rounded-t-3xl">
        <StyledText className={`mb-3 text-2xl font-bold ${theme.colors.primary}`}>6-Digit Code</StyledText>
        <StyledText className={`mb-3 ${theme.colors.gray}`}>Code sent for verification</StyledText>
        <StyledText className={`mb-3 ${theme.colors.gray}`}>Please enter the code below</StyledText>

        {/* ✅ OTP Input Row */}
        <StyledView className="flex-row justify-center space-x-3">
          {otp.map((digit, index) => (
            <StyledTextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el as TextInput | null;
              }}
              className="w-12 h-12 text-lg font-bold text-center border border-gray-400 rounded-lg"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
            />
          ))}
        </StyledView>

        {/* ✅ Submit Button */}
        <StyledTouchableOpacity 
          className="bg-[#0088B1] p-3 rounded-xl mt-5 w-full items-center"
          onPress={verifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <StyledText className="text-lg font-bold text-white">Verify OTP</StyledText>
          )}
        </StyledTouchableOpacity>

        {/* ✅ Close Modal Button */}
        <StyledTouchableOpacity onPress={onClose} className="mt-3">
          <StyledText className="text-gray-500">Cancel</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </Modal>
  );
};

export default OTPModalEmail;
