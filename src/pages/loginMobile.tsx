import React, { useState, useMemo } from "react";
import { IP_ADDR } from "@env";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import EmailLogin from "./loginEmail";
import MobileInput from "./MobileInput";
import EmailSignup from "./signupEmail";
import GoogleLoginButton from "./GoogleLoginButton";
import CustomText from "./CustomText";

// ✅ Styled Components
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledCustomText = styled(CustomText);

const ToggleButtons = ({ isMobile, setIsMobile }) => (
  <StyledView className="flex-row items-center p-1 mb-5 bg-[#E8F4F7] rounded-xl">
    <StyledView className="flex-row flex-1 overflow-hidden bg-white rounded-lg">
      {["Mobile Number", "Email"].map((label, index) => {
        const selected = isMobile === (index === 0);
        return (
          <StyledTouchableOpacity
            key={label}
            className={`flex-1 p-3 items-center ${selected ? "bg-[#0088B1] rounded-lg" : ""}`}
            onPress={() => setIsMobile(index === 0)}
          >
            <StyledCustomText className={`text-lg  ${selected ? "text-white font-bold" : "text-gray-600 "}`}>{label}</StyledCustomText>
          </StyledTouchableOpacity>
        );
      })}
    </StyledView>
  </StyledView>
);

const LoginScreen = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const headerText = useMemo(() => (isSignup ? "Welcome Aboard!!" : "Welcome Back!"), [isSignup]);
  const subHeaderText = useMemo(() => (isSignup ? "Create Account" : "Please, Log In."), [isSignup]);

  const DividerWithText = ({ text }) => (
    <StyledView className="flex-row items-center my-6">
      <StyledView className="flex-1 h-[1px] bg-gray-300" />
      <StyledCustomText className=" font-semibold text-gray-500 text-[16px] p-4">{text}</StyledCustomText> 
      <StyledView className="flex-1 h-[1px] bg-gray-300" />
    </StyledView>
  );

  return (
    <StyledScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <StyledSafeAreaView className="flex-1 bg-[#0088B1]">
        {/* 🟢 Top Section */}
        <StyledView className="items-center justify-center flex-1">
          {(isMobile || isSignup) && (
            <StyledView className="p-8">
              <StyledImage source={require("../assets/photos/Carosel.png")} className="w-70 h-70" resizeMode="contain" />
            </StyledView>
          )}
          <StyledView className="self-start pb-1 pl-5">
            <StyledCustomText className={`${theme.font.primary} ${theme.font.opacity} ${theme.colors.white} text-[20px] ${theme.font.weightMedium} pb-2`} >{headerText}</StyledCustomText>
            <StyledCustomText className={`${theme.font.primary} ${theme.colors.white} text-[40px] ${theme.font.weightBold}`} style={{ lineHeight: 40, paddingBottom: 8 }}>{subHeaderText}</StyledCustomText>
          </StyledView>
        </StyledView>

        {/* 🟢 Bottom Section */}
        <StyledView className="flex-1 pt-10 pb-4 pl-8 pr-8 bg-white rounded-t-3xl">
          {isSignup ? (
            <>
              <EmailSignup />
              <DividerWithText text ="or Login with" />
              <GoogleLoginButton />
            </>
          ) : (
            <>
              <ToggleButtons isMobile={isMobile} setIsMobile={setIsMobile} />
              {isMobile ? <MobileInput /> : <EmailLogin />}
              {!isMobile && <DividerWithText text="or Login with" />}
              {!isMobile && <GoogleLoginButton />}
              <StyledCustomText className={`mt-8 text-base text-center ${theme.colors.black}`}>Need Help?</StyledCustomText>
              <StyledView className="flex-row justify-center mt-8 text-base">
                <StyledCustomText className="mt-6 text-base text-gray-700">Don’t have an account? </StyledCustomText>
                <StyledTouchableOpacity onPress={() => { setIsSignup(true); setIsMobile(false); }}>
                  <StyledCustomText className="mt-6 text-[#0088B1] font-bold text-base">Create Account</StyledCustomText>
                </StyledTouchableOpacity>
              </StyledView>
            </>
          )}
        </StyledView>
      </StyledSafeAreaView>
    </StyledScrollView>
  );
};

export default LoginScreen;
