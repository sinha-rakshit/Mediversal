import React from "react";
import { TouchableOpacity, Text, Image, Alert, View } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { styled } from "nativewind";
import { theme } from "../assets/theme";
import { IP_ADDR } from "@env"; // ✅ Load API URL from .env
import GoogleIcon from "../assets/photos/googleIcon.svg";
import { RootStackParamList } from "../navigation/navigation"; 

// ✅ Styled Components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledView = styled(View);

// ✅ Google Sign-In Configuration
GoogleSignin.configure({
  scopes: ["profile", "email"],
  webClientId: "46248115272-m66gnu362gmi9uflfojcm53a3ihulq90.apps.googleusercontent.com",
});

const GoogleLoginButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const signInData = await GoogleSignin.signIn();
      const idToken = signInData?.data?.idToken; // ✅ Extract only idToken
      console.log(idToken);

      if (!idToken) {
        Alert.alert("Error", "Failed to retrieve Google ID Token.");
        return;
      }

      // ✅ Send idToken to API
      const response = await fetch(`http://13.201.98.12:4000/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.jwt) {
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Login Failed", data.error || "An error occurred.");
      }
    } catch (error: any) {
      // ✅ Handle Sign-in Errors
      const errorMessage = error?.message || "Unknown error occurred";
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert("Cancelled", "Google Sign-In was cancelled.");
          break;
        case statusCodes.IN_PROGRESS:
          Alert.alert("In Progress", "Google Sign-In is already in progress.");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert("Error", "Google Play Services is not available.");
          break;
        default:
          Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <StyledTouchableOpacity
      className="flex-row items-center justify-center px-4 py-3 bg-[#E8F4F7] rounded-xl border-[1px] border-[#0088b1]"
      onPress={handleGoogleLogin}
    >
      <GoogleIcon width={24} height={24} /> 
      <StyledView className="w-[1px] h-6 bg-gray-400 mx-4" />
      <StyledText className={`text-base font-medium ${theme.colors.black}`}>Login with Google</StyledText>
    </StyledTouchableOpacity>
  );
};

export default GoogleLoginButton;
