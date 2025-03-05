import React, { ReactNode } from "react";
import { Text, TextProps } from "react-native";
import { styled } from "nativewind";
import Constants from "../assets/constants"; 

const StyledText = styled(Text);

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({ style, children, ...props }) => {
  return (
    <StyledText 
      style={[{ fontFamily: Constants.fontFamily }, style]} 
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default CustomText;
