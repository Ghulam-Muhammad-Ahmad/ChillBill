import React, { useEffect, useState } from 'react'; // Make sure React is imported
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Spinner from './Spinner';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setSession(session);
      setIsLoading(false);
      if (!session) {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return <Spinner loadingText="Loading..." />;
  }

  return (
    <div className='flex'>
      <div className='csm:hidden' ><DashboardSidebar className='w-1/4 csm:w-full' /></div>
     <div className='w-full relative h-screen px-2 py-4'>
      <DashboardHeader />
      <main className='flex-1 px-10 csm:px-2 h-[85vh] csm:h-fit overflow-auto  '>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child);
        })}
      </main>
        </div>
    </div>
  );
};

export default DashboardLayout;