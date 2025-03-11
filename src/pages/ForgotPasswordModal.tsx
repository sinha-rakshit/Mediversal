import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import ResetPasswordModal from "./ResetPasswordModal";

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
  const [userEmail, setUserEmail] = useState(email);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
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

  // ✅ Verify OTP API Call
  const verifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      Alert.alert("Invalid OTP", "Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://13.201.98.12:4000/api/auth/verifyreset`, {
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
    setTimer(30); // Reset timer

    try {
      const response = await fetch(`http://13.201.98.12:4000/api/auth/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }), // ✅ Use Editable Email
      });

      const data = await response.json();

      if (data.message === "Email Sent Successfully") {
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
    <>
      <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}
      onBackButtonPress={onClose} onSwipeComplete={onClose} swipeDirection={["down"]} animationOut="slideOutDown" animationOutTiming={250}>
        <StyledView className="items-center p-8 bg-[#f8f8f8] rounded-t-3xl">
          <StyledView className="items-left">
            <StyledText className={`mb-3 text-2xl font-bold ${theme.colors.primary}`}>
              Verify to Reset Password
            </StyledText>
            <StyledText className={`mb-3 text-base ${theme.colors.gray}`}>
              We've sent a 6-digit OTP to your email. Please enter it here.
            </StyledText>

            {/* ✅ Wrong Email? Change Email */}
          <StyledView className="self-start">
            <StyledTouchableOpacity onPress={onClose}>
              <StyledText className="mb-3 text-base font-regular">
                <StyledText className={`${theme.colors.gray}`}>Wrong Email? </StyledText>
                <StyledText className="text-[#0088B1]">Change Email</StyledText>
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          
          </StyledView>

          {/* ✅ Editable Email Input */}
          <StyledView
            className={`self-start w-full p-2 mb-3 border border-gray-300 rounded-lg`}
          >
            <StyledTextInput
              className={`text-base ${theme.colors.gray}`}
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </StyledView>

          
          {/* ✅ OTP Input Row */}
          <StyledView className="flex-row justify-center space-x-2">
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
         <StyledView className="flex-row items-center justify-center w-full mt-3 mb-3">
            {timer > 0 ? (
              <StyledText className="font-bold">
                <StyledText className={`${theme.colors.gray}`}>Didn’t get OTP? </StyledText>
                <StyledText className="text-[#0088B1]">{timer}s</StyledText>
              </StyledText>
            ) : (
              <StyledTouchableOpacity onPress={handleResendOTP}>
                <StyledText className="font-bold text-[#0088B1]">Resend OTP</StyledText>
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

      {/* ✅ Reset Password Modal after OTP Verification */}
      {showResetModal && (
        <ResetPasswordModal
          isVisible={showResetModal}
          onClose={() => setShowResetModal(false)}
          email={userEmail} // ✅ Use updated email
          jwt={jwtToken as string}
        />
      )}
    </>
  );
};

export default ForgotPasswordModal;
