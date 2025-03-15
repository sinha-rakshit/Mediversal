import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import Modal from "react-native-modal";
import { theme } from "../../../config/theme";
import ForgotPasswordModal from "./OtpForgotPasswordModal";
import { IP_ADDR } from "@env";

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EmailForgotPasswordModal = ({ isVisible, onClose, email = "" }) => {
  const [userEmail, setUserEmail] = useState(email);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  useEffect(() => {
    setUserEmail(email);
  }, [email]);

  // ✅ Validate Email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (text) => {
    setUserEmail(text);
    setEmailError(""); // ✅ Clear error dynamically when user types
  };

  // ✅ Handle Submit
  const handleSubmit = async () => {
    if (!userEmail.trim()) {
      setEmailError("Email is required.");
      return;
    }
    if (!isValidEmail(userEmail)) {
      setEmailError("Invalid email format.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${IP_ADDR}/api/auth/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (data.message == "Email sent successfully") {
        setForgotPasswordVisible(true); // ✅ Open OTP modal
      } else {
        Alert.alert("Error", data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        animationIn="slideInUp"
        backdropOpacity={0.5}
        style={{ margin: 0, justifyContent: "flex-end" }}
        onBackButtonPress={onClose} onSwipeComplete={onClose} swipeDirection={["down"]} animationOut="slideOutDown" animationOutTiming={250} onBackdropPress={onClose}
      >
        <StyledView className="w-full p-8 bg-white rounded-t-[40px]">
          {/* Title */}
          <StyledView className="mb-4">
            <StyledText className="text-2xl mb-3 font-bold text-[#0088B1]">Reset Your Password</StyledText>
            <StyledText className="pb-2 mt-1 text-base text-gray-500">
              Please enter the registered email below to reset your password
            </StyledText>
          </StyledView>

          {/* ✅ Email Input */}
          <StyledView
            className={`w-full p-1 border rounded-lg ${
              isEmailFocused ? "border-[#0088B1]" : "border-gray-300"
            } mb-2`}
          >
            <StyledTextInput
              className={`text-base ${theme.colors.black} pl-2`}
              placeholder="mediversal@gmail.com"
              value={userEmail}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#b3b3b3"
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
          </StyledView>
          
          {/* ✅ Email Error Message */}
          {emailError ? (
            <StyledText className="mt-2 text-sm text-red-500">{emailError}</StyledText>
          ) : null}

          {/* ✅ Send OTP Button */}
          <StyledTouchableOpacity
            className={`p-3 mt-4 mb-5 w-full rounded-xl items-center ${
              isValidEmail(userEmail) && !loading ? "bg-[#0088B1]" : "border border-[#0088B1] bg-transparent"
            }`}
            onPress={handleSubmit}
            disabled={!isValidEmail(userEmail) || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <StyledText className={`text-base font-regular ${isValidEmail(userEmail) ? "text-white" : "text-[#0088B1]"}`}>
                Send OTP
              </StyledText>
            )}
          </StyledTouchableOpacity>


          {/* ✅ Support Text */}
          <StyledTouchableOpacity className="items-center pb-2 mt-5 text-sm">
            <StyledText className={`${theme.colors.black} ${theme.font.primary}`}>Need Help?</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </Modal>

      {/* ✅ OTP Modal */}
      {forgotPasswordVisible && (
        <ForgotPasswordModal
          isVisible={forgotPasswordVisible}
          onClose={() => setForgotPasswordVisible(false)}
          email={userEmail}
        />
      )}
    </>
  );
};

export default EmailForgotPasswordModal;
