import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { styled } from "nativewind";
import { theme } from "../assets/theme";

// ✅ Styled Components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface CountryPickerProps {
  onSelectCountry: (country: Country) => void;
}

const CountryPickerComponent: React.FC<CountryPickerProps> = ({ onSelectCountry }) => {
  const [countryCode, setCountryCode] = useState<Country["cca2"]>("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleSelect = (country: Country) => {
    setCountryCode(country.cca2 as Country["cca2"]);
    setCallingCode(country.callingCode?.[0] || "91");

    onSelectCountry(country);
    setIsPickerVisible(false); // Close picker after selection
  };

  return (
    <StyledTouchableOpacity onPress={() => setIsPickerVisible(true)} className="flex-row items-center pl-1 pr-2">
      <CountryPicker
        withFlag // ✅ This already shows the flag, so no need for custom flag handling
        withCallingCode
        withFilter
        countryCode={countryCode}
        onSelect={handleSelect}
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
      />
      <StyledText className={` text-lg font-medium text-gray-500`}>+{callingCode}</StyledText>
    </StyledTouchableOpacity>
  );
};

export default CountryPickerComponent;
