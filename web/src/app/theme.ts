import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#222",
    },
    secondary: {
      main: "#6c757d",
      dark: "#6c757d",
      light: "#6c757d",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0f0f3",
    },
    secondary: {
      main: "#6c757d",
      dark: "#6c757d",
      light: "#6c757d",
    },
  },
});
