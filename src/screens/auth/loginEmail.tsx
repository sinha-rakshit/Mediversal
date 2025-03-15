import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { styled } from "nativewind";
import EmailForgotPasswordModal from "./modals/EmailForgotPasswordModal"; // ✅ Updated Import
import { IP_ADDR } from "@env";
import { Eye, EyeOff } from "lucide-react-native"; // 👀 Import password toggle icons
import { theme } from "../../config/theme";
import { RootStackParamList } from "../../navigation/navigation"; 
import GoogleLoginButton from "../../assets/components/GoogleLoginButton";
import { G } from "react-native-svg";

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EmailLogin = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);  

  const DividerWithText = ({ text }) => (
        <StyledView className="flex-row items-center py-8">
          <StyledView className="flex-1 h-[1px] bg-gray-300" />
          <StyledText className="font-regular text-gray-400 text-[16px] px-4 py-2">{text}</StyledText>
          <StyledView className="flex-1 h-[1px] bg-gray-300" />
        </StyledView>
      );

  // ✅ Validate user input
  const validateInput = () => {
    let emailError = "";
    let passwordError = "";

    if (!credentials.email.trim()) {
      emailError = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        emailError = "Invalid email format";
      }
    }

    if (!credentials.password.trim()) {
      passwordError = "Password is required";
    } else {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
      if (!passwordRegex.test(credentials.password)) {
        passwordError =
          "Password must be at least 8 characters, include a capital letter, a number & a special character";
      }
    }

    setErrors({ email: emailError, password: passwordError });
    return !(emailError || passwordError);
  };

  // ✅ Handle login request
  const handleLogin = async () => {
    setShowErrors(true);
    if (!validateInput()) return;

    setLoading(true);
    try {
      const response = await fetch(`${IP_ADDR}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.user) {
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  // ✅ Handle forgot password request
  const handleForgotPassword = async () => {
        setForgotPasswordVisible(true);
  };

  return (
    <StyledView>
      {/* Email Input */}
      <StyledTextInput
        className={`p-4 mb-1 mt-2 text-base ${theme.colors.black} border ${
          isEmailFocused ? "border-[#0088b1]" : "border-gray-300"
        } rounded-xl`}
        placeholder="mediversal@gmail.com"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="done"
        placeholderTextColor="#b3b3b3"
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
      />
      {showErrors && errors.email && (
        <StyledText className="mb-2 text-red-500">{errors.email}</StyledText>
      )}

      {/* Password Input with Toggle Visibility */}
      <StyledView className="relative">
        <StyledTextInput
          className="p-4 pr-12 mt-4 text-base text-gray-500 border border-gray-300 rounded-xl"
          placeholder="*********"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          secureTextEntry={!isPasswordVisible} // ✅ Ensures it updates correctly
          returnKeyType="done"
          placeholderTextColor="#b3b3b3"
        />
        
        {/* ✅ Make the eye icon more clickable */}
        <StyledTouchableOpacity
          className="absolute p-3 rounded-full right-2 top-5"
          onPress={() => setIsPasswordVisible((prevState) => !prevState)}
        >
          {isPasswordVisible ? <EyeOff size={24} color="#0088b1" /> : <Eye size={24} color="#0088b1" />}
        </StyledTouchableOpacity>
      </StyledView>

      {showErrors && errors.password && (
        <StyledText className="mt-2 text-red-500">{errors.password}</StyledText>
      )}

      {/* Forgot Password Link */}
      <StyledView className="flex flex-row justify-end w-full py-8">
        <StyledTouchableOpacity onPress={handleForgotPassword} className="">
          <StyledText className="text-[#0088B1] text-base font-xl font-regular">
            Forgot Password?
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Login Button */}
      <StyledTouchableOpacity
        className="p-4  rounded-xl items-center bg-[#0088B1]"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <StyledText className={`text-base font-regular ${theme.colors.white}`}>Login</StyledText>
        )}
      </StyledTouchableOpacity>

      <DividerWithText text="or Login with" />
      <GoogleLoginButton />

      <StyledView className="flex-row justify-center m-8">
        <StyledTouchableOpacity onPress={() => {/* Add Help Functionality Here */}}>
          <StyledText className={`${theme.colors.black} font-regular text-sm`}>
            Need Help?
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      

      {/* Forgot Password Email Modal */}
      {forgotPasswordVisible && (
        <EmailForgotPasswordModal
        isVisible={forgotPasswordVisible}
        onClose={() => setForgotPasswordVisible(false)}
        email={credentials.email}
      />      
      )}
    </StyledView>
  );
};

export default EmailLogin;
