import {SessionProvider} from 'next-auth/react';
import '../styles/globals.css';
import { createTheme, ThemeProvider  } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
export default function App({Component, pageProps: {session, ...pageProps}}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={darkTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}