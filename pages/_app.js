// pages/_app.js
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import '../styles/globals.css'; // Your global styles

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}> {/* Wrap your app here */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
