import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Modal from "react-native-modal";
import { styled } from "nativewind";
import { theme } from "../../../config/theme";
import axios from "axios";
import { IP_ADDR } from "@env";
import { RootStackParamList } from "../../../navigation/navigation"; 

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

const OtpMobileModal: React.FC<OTPModalProps> = ({ isVisible, onClose, onGoBack, phoneNumber }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    if (!/^\d*$/.test(value)) return; // Allow only numbers
  
    const newOtp = [...otp];
  
    if (value.length > 1) {
      // Handle full OTP paste
      const pastedValues = value.split("").slice(0, 6); // Ensure max length of 6
      pastedValues.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus(); // Move focus to the last input
    } else {
      // Handle single character input
      newOtp[index] = value;
      setOtp(newOtp);
  
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: any) => {
    const pastedText = event.nativeEvent.text;
    
    if (/^\d{6}$/.test(pastedText)) {
      // ✅ Distribute pasted OTP
      setOtp(pastedText.split(""));
      
      // Move focus to the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join("");

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
        navigation.navigate("HomeScreen");
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
    <Modal isVisible={isVisible} style={{ margin: 0, justifyContent: "flex-end" }}
    onBackButtonPress={onClose} onSwipeComplete={onClose} swipeDirection={["down"]} animationOut="slideOutDown" animationOutTiming={250} onBackdropPress={onClose}>
      <StyledView className="items-center p-5 bg-[#f8f8f8] rounded-t-[40px]">
        <StyledView className="self-start pl-3">
          <StyledText className={`mb-3 text-3xl font-bold ${theme.colors.primary}`}>
            6-Digit OTP
          </StyledText>
          <StyledText className={` text-base pb-4 ${theme.colors.gray}`}>
            OTP sent to {phoneNumber} for verification. {'\n'}
            Please enter the code here.
          </StyledText>

        {/* ✅ Wrong Email? Change Email */}
          <StyledTouchableOpacity onPress={onClose}>
            <StyledText className="mb-6 text-base font-regular">
              <StyledText className={`${theme.colors.gray}`}>Wrong number? </StyledText>
              <StyledText className="text-[#0088B1]">Edit Number</StyledText>
            </StyledText>
          </StyledTouchableOpacity>
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
              otp[index] ? "border-[#0088B1]" : "border-gray-300"
            } rounded-lg`}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(value) => handleOTPChange(value, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => {
              setOtp((prevOtp) => {
                const newOtp = [...prevOtp];
                newOtp[index] = ""; // Clear field when focused
                return newOtp;
              });
            }}
            onChange={handlePaste} // ✅ Detect full paste
          />
          ))}
        </StyledView>

        {/* ✅ Timer & Resend OTP */}
        <StyledView className="flex-row items-center justify-center w-full px-5 mt-3 mb-3">
          {timer > 0 ? (
            <StyledText className="font-medium text-center">
              <StyledText className={`${theme.colors.gray}`}>Didn't get OTP? Resend in </StyledText>
              <StyledText className={`${theme.colors.primary}`}>{timer}s</StyledText>
            </StyledText>
          ) : (
            <StyledTouchableOpacity onPress={handleResendOTP}>
              <StyledText className={`font-medium text-center ${theme.colors.primary}`}>
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
          <StyledText className={`text-base font-regular ${isOtpFilled ? "text-[#f8f8f8]" : "text-[#0088B1]"}`}>
            Verify & Continue
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </Modal>
  );
};

export default OtpMobileModal;
