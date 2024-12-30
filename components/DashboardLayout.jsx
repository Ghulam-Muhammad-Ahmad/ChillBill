import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log(session)
      setSession(session);
      setIsLoading(false);  // Set loading to false after fetching the session
      if (!session) {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  // Only render when the session is checked or loading is finished
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DashboardHeader />
      <main className='pt-[90px]'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
