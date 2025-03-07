import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import OTPModalEmail from "./OTPModalEmail";
import { Eye, EyeOff } from "lucide-react-native";
import { IP_ADDR } from "@env";
import { theme } from "../assets/theme";
import LoginScreen from "./loginMobile"; // ✅ Import LoginScreen
import { useNavigation } from "@react-navigation/native"; // ✅ Import navigation hook

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOTPModalVisible, setOTPModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  

  // ✅ Email validation regex
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Password validation regex
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSignUp = async () => {
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
  
    if (!password.trim()) {
      Alert.alert("Missing Password", "Please enter your password.");
      return;
    }
  
    if (!isValidPassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
  
    if (!confirmPassword.trim()) {
      Alert.alert("Confirm Password", "Please confirm your password.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match!");
      return;
    }
  
    // ✅ Only proceed with API request if validation passes
    setLoading(true);
  
    try {
      const response = await fetch(`http://13.201.98.12:4000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_method: "email", email, password }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      // ✅ Check if response contains "message": "Email sent successfully"
      if (data.message === "Email sent successfully") {
        setOTPModalVisible(true);
      } else {
        Alert.alert("Sign-Up Failed", data.message || "Something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Network issue. Please try again later.");
    }
  };

  return (
    <StyledView>
      {/* Email Input */}
      <StyledTextInput
        className={`p-4 mb-4 text-base ${theme.colors.black} border ${
          isEmailFocused ? "border-[#0088b1]" : "border-gray-300"
        } rounded-xl`}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="done"
        placeholderTextColor="#b3b3b3"
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
      />

      {/* Password Input with Eye Icon */}
      <StyledView className="relative">
      <StyledTextInput
          className={`p-4 pr-12 mb-4 text-base ${theme.colors.black} border ${
            isPasswordFocused ? "border-[#0088b1]" : "border-gray-300"
          } rounded-xl`}
          placeholder="**********"
          secureTextEntry={!isPasswordVisible} 
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          placeholderTextColor="#b3b3b3"
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <StyledTouchableOpacity
          className="absolute pl-3 pr-3 right-4 top-4"
          onPress={() => setIsPasswordVisible(!isPasswordVisible)} // ✅ Toggle Password Visibility
        >
          {isPasswordVisible ? <EyeOff size={24} color="#0088b1" /> : <Eye size={24} color="#0088b1" />}
        </StyledTouchableOpacity>
      </StyledView>

      {/* Confirm Password Input */}
      <StyledView className="relative">
      <StyledTextInput
          className={`p-4 pr-12 text-base ${theme.colors.black} border ${
            isConfirmPasswordFocused ? "border-[#0088b1]" : "border-gray-300"
          } rounded-xl`}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          returnKeyType="done"
          placeholderTextColor="#b3b3b3"
          onFocus={() => setIsConfirmPasswordFocused(true)}
          onBlur={() => setIsConfirmPasswordFocused(false)}
        />
        <StyledTouchableOpacity
          className="absolute pl-3 pr-3 right-4 top-4"
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} // ✅ Toggle Confirm Password Visibility
        >
          {isConfirmPasswordVisible ? <EyeOff size={24} color="#0088b1" /> : <Eye size={24} color="#0088b1" />}
        </StyledTouchableOpacity>
      </StyledView>

      {/* Sign-Up Button */}
      <StyledTouchableOpacity
        className="bg-[#0088B1] p-4 rounded-xl items-center mt-5 "
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#ffffff" /> : <StyledText className={`text-lg font-bold ${theme.colors.white}`}>Sign Up</StyledText>}
      </StyledTouchableOpacity>

      {/* OTP Modal */}
      <OTPModalEmail 
        isVisible={isOTPModalVisible} 
        onClose={() => setOTPModalVisible(false)} 
        email={email}
        password={email}
      />
    </StyledView>
  );
};

export default EmailSignup;
