import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/inter";

const theme = extendTheme({
  fonts: {
    heading: `'Inter Variable', sans-serif`,
    body: `'Inter Variable', sans-serif`,
  },
  colors: {
    facebook: {
      500: "#42567B",
      600: "#42567B",
      700: "#42567B",
    },
    red: {
      500: "#c44e4e",
      600: "#c44e4e",
      700: "#c44e4e",
    },
  },
  fontSizes: {
    xs: "0.875rem",
    sm: "1rem",
  },
});

export default theme;
