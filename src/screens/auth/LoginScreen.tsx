  import React, { useState, useMemo, useEffect } from "react";
  import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView, 
    Image, 
    ScrollView, 
    LayoutAnimation, 
    UIManager, 
    Platform, 
    BackHandler,
    Alert
  } from "react-native";
  import { styled } from "nativewind";
  import { theme } from "../../config/theme";
  import EmailLogin from "./loginEmail";
  import MobileLogin from "./loginMobile";
  import EmailSignup from "./signupEmail";
  import GoogleLoginButton from "../../assets/components/GoogleLoginButton";
  import CustomText from "../../config/CustomText";
  import CarouselSVG from "../../assets/photos/Carosel.svg";

  // ✅ Enable LayoutAnimation for Android
  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // ✅ Styled Components
  const StyledSafeAreaView = styled(SafeAreaView);
  const StyledView = styled(View);
  const StyledTextInput = styled(TextInput);
  const StyledTouchableOpacity = styled(TouchableOpacity);
  const StyledImage = styled(Image);
  const StyledScrollView = styled(ScrollView);
  const StyledCustomText = styled(CustomText);

  const ToggleButtons = ({ isMobile, setIsMobile }) => {
    const handleToggle = (value) => {
      LayoutAnimation.easeInEaseOut();
      setIsMobile(value);
    };

    return (
      <StyledView className="flex-row items-center p-1 mb-6 bg-[#e8f4f7] rounded-xl">
        <StyledView className={`flex-row flex-1 overflow-hidden bg-[#f8f8f8] rounded-lg`}>
          {["Mobile Number", "Email"].map((label, index) => {
            const selected = isMobile === (index === 0);
            return (
              <StyledTouchableOpacity
                key={label}
                className={`flex-1 p-3 items-center ${selected ? "bg-[#0088B1] rounded-lg" : ""}`}
                onPress={() => handleToggle(index === 0)}
              >
                <StyledCustomText className={`text-sm ${selected ? "text-[#f8f8f8] font-semibold" : "text-gray-600"}`}>
                  {label}
                </StyledCustomText>
              </StyledTouchableOpacity>
            );
          })}
        </StyledView>
      </StyledView>
    );
  };

  const LoginScreen = () => {
    const [isMobile, setIsMobile] = useState(true);
    const [isSignup, setIsSignup] = useState(false);

    const headerText = useMemo(() => (isSignup ? "Welcome Aboard!!" : "Welcome To"), [isSignup]);
    const subHeaderText = useMemo(() => (isSignup ? "Create Account" : "Please, Log In."), [isSignup]);

    // 🟢 Handle Android Back Button
    useEffect(() => {
      const handleBackPress = () => {
        if (isSignup) {
          setIsSignup(false); // Navigate back to Email Login
          setIsMobile(false); // Ensure it switches to Email section
          return true; // Prevent default behavior (app closing)
        }

        // ✅ Show Exit Confirmation Dialog
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() }
          ]
        );

        return true; // Prevent default back action (app closing)
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => backHandler.remove(); // ✅ Remove listener when unmounted
    }, [isSignup]);
    

    return (
      <StyledScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <StyledSafeAreaView className="flex-1 bg-[#0088B1]">
          {/* 🟢 Top Section */}
          <StyledView className="items-center justify-center flex-1">
            {(isMobile || isSignup) && (
              <StyledView className="p-8">
                <CarouselSVG width={280} height={280} preserveAspectRatio="xMidYMid meet" />
              </StyledView>
            )}
            <StyledView className="self-start py-6 pl-8">
              <StyledCustomText className={`${theme.font.primary} ${theme.colors.white} text-[20px] ${theme.font.weightRegular} py-1`}>
                {headerText}
              </StyledCustomText>

              {!isSignup ? (
                <>
                  <StyledCustomText 
                    className={`${theme.font.primary} ${theme.colors.white} text-[40px] ${theme.font.weightBold} pb-1`} 
                    style={{ lineHeight: 42 }}
                  >
                    Mediversal
                  </StyledCustomText>
                  <StyledCustomText 
                    className={`${theme.font.primary} ${theme.colors.white} text-[20px] ${theme.font.weightRegular}`} 
                    style={{ paddingBottom: 14 }}
                  >
                    Easy Healthcare, In Your Hands
                  </StyledCustomText>
                </>
              ) : (
                <StyledCustomText 
                  className={`${theme.font.primary} ${theme.colors.white} text-[40px] ${theme.font.weightBold}`} 
                  style={{ lineHeight: 42, paddingBottom: 14 }}
                >
                  {subHeaderText}
                </StyledCustomText>
              )}
            </StyledView>
          </StyledView>

          {/* 🟢 Bottom Section */}
          <StyledView className="flex-1 pt-12 pl-8 pr-8 bg-[#f8f8f8] rounded-t-[40px]">
            {isSignup ? (
              <>
                <EmailSignup />
              </>
            ) : (
              <>
                <ToggleButtons isMobile={isMobile} setIsMobile={setIsMobile} />
                {isMobile ? <MobileLogin /> : <EmailLogin />}

                {/* "Don't have an account? Create Account" only for Email Login */}
                {!isMobile && (
                  <StyledView className="flex-row justify-center">
                    <StyledCustomText className={`text-sm ${theme.colors.black}`}>
                      Don’t have an Account?
                    </StyledCustomText>
                    <StyledTouchableOpacity onPress={() => { setIsSignup(true); setIsMobile(false); }}>
                      <StyledCustomText className="text-[#0088B1] font-semibold text-sm">
                        {" "}Create One
                      </StyledCustomText>
                    </StyledTouchableOpacity>
                  </StyledView>
                )}
                {!isMobile && (
                  <StyledCustomText className={`text-xs text-center ${theme.colors.gray} mt-10 mb-6 `}>
                    By logging in, you agree to our{" "}
                    <StyledCustomText className={`${theme.colors.black}`}>
                      Terms & Conditions
                    </StyledCustomText>
                  </StyledCustomText>
                )}
              </>
            )}
          </StyledView>
        </StyledSafeAreaView>
      </StyledScrollView>
    );
  };

  export default LoginScreen;
