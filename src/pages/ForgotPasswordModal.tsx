import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import ResetPasswordModal from "./ResetPasswordModal";
import { IP_ADDR } from "@env";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface OTPModalProps {
  isVisible: boolean;
  onClose: () => void;
  email: string;
}

const ForgotPasswordModal: React.FC<OTPModalProps> = ({ isVisible, onClose, email }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  // ✅ Resend OTP State
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendDisabled && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendTimer, isResendDisabled]);

  // ✅ Handle OTP Input
  const handleOTPChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    setTimeout(() => {
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }, 0);
  };

  // ✅ Verify OTP API Call
  const verifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${IP_ADDR}/api/auth/verifyreset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.jwt) {
        setJwtToken(data.jwt);
        setShowResetModal(true);
      } else {
        Alert.alert("OTP Verification Failed", data.message || "Invalid OTP.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    }
  };

  // ✅ Resend OTP Logic
  const handleResendOTP = async () => {
    setIsResendDisabled(true);
    setResendTimer(30); // Reset timer

    try {
      const response = await fetch(`${IP_ADDR}/api/auth/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.message === "OTP Sent") {
        Alert.alert("Success", "A new OTP has been sent to your email.");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <>
      <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}>
        <StyledView className="items-center p-5 bg-white rounded-t-3xl">
          <StyledText className={`mb-3 text-xl font-bold ${theme.colors.primary}`}>
            Forgot Password
          </StyledText>
          <StyledText className="mb-3 text-base text-gray-600 text-start">
            Code has been sent to your email. Please enter the 6-digit code below.
          </StyledText>

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

          {/* ✅ Verify Button */}
          <StyledTouchableOpacity
            className="bg-[#0088B1] p-3 rounded-xl mt-5 w-full items-center"
            onPress={verifyOTP}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <StyledText className="text-lg font-bold text-white">Verify OTP</StyledText>}
          </StyledTouchableOpacity>

          {/* ✅ Resend OTP Button with Timer */}
          <StyledTouchableOpacity
            className={`mt-3 ${isResendDisabled ? "opacity-50" : ""}`}
            onPress={handleResendOTP}
            disabled={isResendDisabled}
          >
            <StyledText className="text-lg font-bold text-blue-600">
              {isResendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </Modal>

      {/* ✅ Reset Password Modal after OTP Verification */}
      {showResetModal && (
        <ResetPasswordModal
          isVisible={showResetModal}
          onClose={() => setShowResetModal(false)}
          email={email}
          jwt={jwtToken as string}
        />
      )}
    </>
  );
};

export default ForgotPasswordModal;
