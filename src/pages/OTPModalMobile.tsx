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

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter all 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`http://13.201.98.12:4000/api/auth/verifyotp`, {
        phone: phoneNumber,
        otp: enteredOTP,
        auth_method: "phone",
      });

      const { jwt, message } = response.data;

      if (jwt) {
        Alert.alert("OTP Verified", "Next part is under development.");
      } else {
        Alert.alert("Error", message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(`http://13.201.98.12:4000/api/auth/register`, {
        phone: phoneNumber,
        auth_method: "phone",
      });
      if (response.data.message === "SMS sent successfully") {
        setTimer(60);
      } else {
        Alert.alert("Error", response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not resend OTP. Please try again.");
    }
  };

  const isOtpFilled = otp.every((digit) => digit !== "");

  return (
    <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}>
      <StyledView className="items-center p-5 bg-[#f8f8f8] rounded-t-3xl">
        <StyledView className="self-start pl-3">
          <StyledText className={`mb-3 text-3xl font-bold ${theme.colors.primary}`}>
            6-Digit OTP
          </StyledText>
          <StyledText className={`mb-3 text-base pb-4 ${theme.colors.gray}`}>
            OTP sent to {phoneNumber} for verification.
            Please enter the code here.
          </StyledText>
        </StyledView>

        {/* ✅ OTP Input Row */}
        <StyledView className="flex-row justify-center space-x-3">
          {otp.map((digit, index) => (
            <StyledTextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el as TextInput | null;
              }}
              className={`w-12 h-12 text-lg font-bold text-center border ${
                digit ? "border-[#0088B1]" : "border-gray-300"
              } rounded-lg`}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
            />
          ))}
        </StyledView>

        {/* ✅ Timer & Resend OTP */}
        <StyledView className="flex-row items-center justify-center w-full px-5 mt-3 mb-3">
          {timer > 0 ? (
            <StyledText className="font-bold text-center">
              <StyledText className={`${theme.colors.gray}`}>Didn't get OTP? Resend in </StyledText>
              <StyledText className={`${theme.colors.primary}`}>{timer}s</StyledText>
            </StyledText>
          ) : (
            <StyledTouchableOpacity onPress={handleResendOTP}>
              <StyledText className={`font-bold text-center ${theme.colors.primary}`}>
                Resend OTP
              </StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>


        {/* ✅ Verify OTP Button */}
        <StyledTouchableOpacity
          className={`p-3 rounded-xl mt-5 w-full items-center ${
            isOtpFilled ? "bg-[#0088B1]" : "border border-[#0088B1] bg-transparent"
          }`}
          onPress={isOtpFilled ? handleVerifyOTP : () => {}}
          disabled={!isOtpFilled}
        >
          <StyledText className={`text-lg font-bold ${isOtpFilled ? "text-[#f8f8f8]" : "text-[#0088B1]"}`}>
            Verify OTP
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </Modal>
  );
};

export default OTPModalMobile;
