import React, { useState, useRef, useEffect } from "react";
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

  // ✅ Timer State
  const [timer, setTimer] = useState(30);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isVisible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, timer]);

  // ✅ Handle OTP Input
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

  // ✅ Handle OTP Verification
  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://13.201.98.12:4000/api/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, password, auth_method: "email" }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success", data.message || "OTP Verified Successfully!");
        onClose();
      } else {
        Alert.alert("Error", data.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Failed to verify OTP. Please check your internet connection.");
    }
  };

  // ✅ Resend OTP Logic
  const handleResendOTP = async () => {
    setTimer(30); // Reset timer

    try {
      const response = await fetch(`http://13.201.98.12:4000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_method: "email", email, password }),
      });

      const data = await response.json();

      if (data.message === "Email sent successfully") {
        Alert.alert("Success", "A new OTP has been sent to your email.");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again later.");
    }
  };

  const isOtpFilled = otp.every((digit) => digit !== "");

  return (
    <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}>
      <StyledView className="items-center px-8 py-8  bg-[#f8f8f8] rounded-t-3xl">
        <StyledView className="self-start">
          <StyledText className={`mb-3 text-2xl font-bold ${theme.colors.primary}`}>
            Email Verification
          </StyledText>
          <StyledText className={`mb-3 ${theme.font.sizeLg} ${theme.colors.gray}`}>
            We've sent a 6-digit OTP to your email. Please enter it below.
          </StyledText>
        </StyledView>

        <StyledTouchableOpacity onPress={onClose} className="self-start pb-6 mt-3">
          <StyledText className={`text-base ${theme.colors.gray}`}>
            Wrong email? <StyledText className="text-[#0088B1] text-base">Change Email</StyledText>
          </StyledText>
        </StyledTouchableOpacity>

        {/* ✅ Email Container */}
        <StyledView className="self-start w-full p-4 mb-5 border border-gray-300 rounded-lg">
          <StyledText className="font-semibold text-[#b3b3b3] text-base">{email}</StyledText>
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
                digit ? "border-[#0088B1]" : "border-gray-400"
              } rounded-lg`}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
            />
          ))}
        </StyledView>

        {/* ✅ Timer & Resend OTP */}
        <StyledView className="flex-row items-center justify-center w-full mt-3 mb-3">
          {timer > 0 ? (
            <StyledText className="text-base font-regular">
              <StyledText className={`${theme.colors.gray} `}>Didn’t get OTP? Resend in </StyledText>
              <StyledText className="text-[#0088B1]">{timer}s</StyledText>
            </StyledText>
          ) : (
            <StyledTouchableOpacity onPress={handleResendOTP}>
              <StyledText className="font-semibold text-[#0088B1]">Resend OTP</StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>


        {/* ✅ Verify OTP Button */}
        <StyledTouchableOpacity
          className={`p-3 rounded-xl mt-5 w-full items-center ${
            isOtpFilled ? "bg-[#0088B1]" : "border border-[#0088B1] bg-transparent"
          }`}
          onPress={isOtpFilled ? verifyOTP : () => {}}
          disabled={!isOtpFilled || loading}
        >
          {loading ? (
            <ActivityIndicator color="[#f8f8f8]" />
          ) : (
            <StyledText className={`text-lg font-bold ${isOtpFilled ? "text-[#f8f8f8]" : "text-[#0088B1]"}`}>
              Verify OTP
            </StyledText>
          )}
        </StyledTouchableOpacity>

       
      </StyledView>
    </Modal>
  );
};

export default OTPModalEmail;
