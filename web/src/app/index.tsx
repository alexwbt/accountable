import styled from "@emotion/styled";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode, useState } from "react";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useKeyListener from "../lib/hooks/event/useKeyListener";
import router from "./router";
import store from "./store";
import { darkTheme, lightTheme } from "./theme";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  const [theme, setTheme] = useState(darkTheme);
  useKeyListener(["\\"], ["ctrlKey"], () => {
    setTheme(t => t === darkTheme ? lightTheme : darkTheme);
  });

  return (
    <StrictMode>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContainer>
            <ToastContainer
              draggable
              hideProgressBar
              closeOnClick
              pauseOnHover
              closeButton={false}
              autoClose={3000}
              theme="colored"
            />
            <RouterProvider router={router} />
          </AppContainer>
        </ThemeProvider>
      </StoreProvider>
    </StrictMode>
  );
};

export default App;
