import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

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
            background:myThemeBase.palette.secondary.light
          }
        },
      }
    } 
  } 
});
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={myTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
