import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";

import store from "../app/store";
import "../styles/globals.css";

const myThemeBase = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0f0",
    },
    secondary: {
      main: "#7b1fa2",
    },
    background: {
      default: "#111111",
      paper: "#212121",
    },
    text: {
      primary: "#ffebee",
    },
  },
});

const myTheme = createTheme(myThemeBase, {
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            background: myThemeBase.palette.secondary.light,
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
