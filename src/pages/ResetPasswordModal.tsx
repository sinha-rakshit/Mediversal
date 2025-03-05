import React, { useState } from "react";
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

interface ResetPasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  email: string;
  jwt: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isVisible, onClose, email, jwt }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Password Validation Function
  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  // ✅ Handle Password Reset
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one special character, and one number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${IP_ADDR}/api/auth/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      Alert.alert("Response", JSON.stringify(responseData));
      
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}>
      <StyledView className="items-center p-5 bg-white rounded-t-3xl">
        <StyledText className={`mb-3 text-xl font-bold ${theme.colors.primary}`}>Reset Password</StyledText>
        <StyledText className="mb-3 text-base text-center text-gray-600">
          Set a new Password. Make sure it's different from the previous one.
        </StyledText>

        {/* ✅ Password Input */}
        <StyledTextInput
          className="w-full p-3 mb-3 text-lg text-gray-500 border border-gray-400 rounded-lg"
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="gray"
        />

        {/* ✅ Confirm Password Input */}
        <StyledTextInput
          className="w-full p-3 mb-3 text-lg text-gray-500 border border-gray-400 rounded-lg"
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="gray"
        />


        {/* ✅ Reset Password Button */}
        <StyledTouchableOpacity
          className="bg-[#0088B1] p-3 rounded-xl mt-3 w-full items-center"
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <StyledText className="text-lg font-bold text-white">Reset Password</StyledText>
          )}
        </StyledTouchableOpacity>
      </StyledView>
    </Modal>
  );
};

export default ResetPasswordModal;
