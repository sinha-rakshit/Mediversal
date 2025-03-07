export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    white: string;
    black: string;
    gray: string;
    tertiary: string;
  };
  font: {
    primary: string;
    bold: string;
    sizeLg: string;
    sizeXl: string;
    sizeVeryXl: string;
    weightMedium: string;
    weightBold: string;
    opacity: string;
    weightRegular: string;
    semiBold: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: "text-[#0088B1]",
    secondary: "text-[#F8F8F8]",
    tertiary: "text-[#E8F4F7]",
    white: "text-[#F8F8F8]",
    black: "text-[#161d1f]",
    gray: "text-gray-400",
  },
  font: {
    primary: "PlusJakartaSansMedium",
    bold: "PlusJakartaSansMedium",
    sizeLg: "text-lg",
    sizeXl: "text-3xl",
    sizeVeryXl: "text-5xl",
    weightMedium: "font-medium",
    weightBold: "font-bold",
    opacity: "opacity-70",
    weightRegular: "font-regular",
    semiBold: "font-semibold",
  },
};
