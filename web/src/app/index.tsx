import styled from "@emotion/styled";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useKeyListener from "../lib/hooks/event/useKeyListener";
import router from "./router";
import { darkTheme, lightTheme } from "./theme";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const App = () => {

  const [theme, setTheme] = useState(darkTheme);

  useKeyListener(["\\"], ["altKey"], () => {
    setTheme(t => t === darkTheme ? lightTheme : darkTheme);
  });

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContainer>
          <ToastContainer />
          <RouterProvider router={router} />
        </AppContainer>
      </ThemeProvider>
    </StrictMode>
  );
};

export default App;
