import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import axios from "axios";
import { IP_ADDR } from "@env";

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  onGoBack: () => void;
  phoneNumber: string;
}

const OTPModalMobile: React.FC<OTPModalProps> = ({ isVisible, onClose, onGoBack, phoneNumber }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, timer]); 
  

  const handleOTPChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    setTimeout(() => {
      if (value && index < 5) {
        // Move to next input if a digit is entered
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        // Move back if a digit is removed
        inputRefs.current[index - 1]?.focus();
      }
    }, 0);
  };
  
  

  // ✅ Verify OTP API Call
  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join(""); // Convert array to string
  
    if (enteredOTP.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter all 6 digits.");
      return;
    }
  
    try {
      const response = await axios.post(`${IP_ADDR}/api/auth/verifyotp`, {
        phone: phoneNumber,
        otp: enteredOTP,
        auth_method: "phone",
      });

      const { jwt, message } = response.data; 

      if (jwt) {
        Alert.alert("OTP Verified", "Next part is under development.");
        return;
      } else {
        Alert.alert("Error", message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
}; 

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(`${IP_ADDR}/api/auth/register`, {
        phone: phoneNumber, auth_method:"phone"
      });
      if (response.data.message == "SMS sent successfully") {
        setTimer(60); 
      } else {
        Alert.alert("Error", response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not resend OTP. Please try again.");
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
              className={`w-12 h-12 text-lg font-bold text-center border border-gray-400 rounded-lg focus:${theme.colors.primary}`}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
            />
          ))}
        </StyledView>

        <StyledView className="flex-row items-center mt-1 mb-3">
          {/* ⏳ Timer */}
          <StyledText className={`mr-3 font-bold ${theme.colors.primary}`}>{timer}s</StyledText>

          {/* ✅ Resend OTP Button */}
          {timer === 0 && (
            <StyledTouchableOpacity onPress={(handleResendOTP)}>
              <StyledText className={`font-bold ${theme.colors.gray}`}>Resend OTP</StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>

        {/* ✅ Verify OTP Button */}
        <StyledTouchableOpacity
          className="bg-[#0088B1] p-3 rounded-xl mt-5 w-full items-center"
          onPress={handleVerifyOTP}
        >
          <StyledText className="text-lg font-bold text-white">Verify OTP</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </Modal>
  );
};

export default OTPModalMobile;
