// pages/_app.js
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import '../styles/globals.css'; // Your global styles
import '../styles/marquee.css'
import { MonthProvider } from '@/context/monthContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <MonthProvider> {/* Wrap your app here */}
        <Component {...pageProps} />
        <SpeedInsights />
      </MonthProvider>
    </SessionProvider>
  );
}

export default MyApp;
