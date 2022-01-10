import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";

import store from "../app/store";
import "../styles/globals.css";

const base = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#00ff00",
    },
    background: {
      default: "#111111",
      paper: "#212121",
    },
    text: {
      primary: "#ffffff",
      disabled: "rgba(255,255,255,0.5)",
      hint: "rgba(255,255,255,0.4)",
      secondary: "rgba(255,255,255,0.8)",
    },
    secondary: {
      main: "#7b1fa2",
    },
    divider: "rgba(255,255,255,0.11)",
    success: {
      main: "#4caf50",
      light: "#73c177",
      dark: "#357a38",
      contrastText: "rgba(10,10,10,0.87)",
    },
    action: {
      hover: "#0000ff",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#aa2e25",
    },
  },
});

const myTheme = createTheme(base, {
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid",
          borderColor: base.palette.primary.main,
          "&.Mui-selected": {
            background: "#4caf4f6e",
          },
          "&:hover": {
            background: "#4caf4f36",
          },
          "&:hover.Mui-selected": {
            background: "#4caf4f81",
          },

          "& .MuiListItemText-primary": {
            color: base.palette.primary.main,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "#2b2b2bb4",
          "& .MuiInputLabel-root": { color: base.palette.text.hint },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            color: base.palette.text.secondary,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: base.palette.primary.main,
          },
          "& .MuiOutlinedInput-input": {
            color: base.palette.text.primary,
          },
          "& .MuiOutlinedInput-root fieldset": {
            borderColor: base.palette.primary.light,
          },
          "& .MuiOutlinedInput-root:hover fieldset": {
            borderColor: base.palette.primary.dark,
          },
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: base.palette.primary.main,
          },
        },
      },
    },
  },
});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider theme={myTheme}>
          <React.StrictMode>
            <Component {...pageProps} />
          </React.StrictMode>
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
}
