import styled from "@emotion/styled";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialogs from "../lib/components/ConfirmDialog";
import router from "./router";
import store, { useSelector } from "./store";
import * as themes from "./theme";

const AppContentContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const AppContent: React.FC = () => {
  const theme = useSelector(s => s.settings.theme);
  return (
    <AppContentContainer>
      <ThemeProvider theme={themes[`${theme}Theme`]}>
        <CssBaseline />
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
        <ConfirmDialogs />
      </ThemeProvider>
    </AppContentContainer>
  );
};

const App: React.FC = () => {
  return (
    <StrictMode>
      <StoreProvider store={store}>
        <AppContent />
      </StoreProvider>
    </StrictMode>
  );
};

export default App;
