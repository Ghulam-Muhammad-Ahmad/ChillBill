import React from 'react'; // Make sure React is imported
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children, monthNumber, setMonthNumber  }) => {
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DashboardHeader monthNumber={monthNumber} setMonthNumber={setMonthNumber} />
      <main className='pt-[90px] csm:pt-2'>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { monthNumber, setMonthNumber });
        })}
      </main>
    </div>
  );
};

export default DashboardLayout;