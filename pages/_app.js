// pages/_app.js
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import '../styles/globals.css'; // Your global styles
import '../styles/marquee.css'
import { MonthProvider } from '@/context/monthContext';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <MonthProvider> {/* Wrap your app here */}
        <Component {...pageProps} />
      </MonthProvider>
    </SessionProvider>
  );
}

export default MyApp;
