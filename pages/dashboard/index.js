"use client"
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardExpense from '@/components/DashboardExpense';
import axios from 'axios';

const Dashboard = () => {
  const [daterange, setDaterange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 0, 1).toISOString()
  });

  const [categoryData, setCategoryData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          const categoryResponse = await axios.get('/api/category', {
            params: { userEmail: session?.user?.email },
          });
          setCategoryData(categoryResponse.data);

          const expenseResponse = await axios.get('/api/expense', {
            params: { userEmail: session?.user?.email },
          });
          setExpenseData(expenseResponse.data);

          const incomeResponse = await axios.get('/api/income', {
            params: { userEmail: session?.user?.email },
          });
          setIncomeData(incomeResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [session?.user?.email]);

  return (
    <DashboardLayout>
      <h1 className='text-center text-3xl font-bold pt-5'>Welcome {session?.user?.username}!</h1>
      <div className='flex justify-center items-center max-w-[1200px] mx-auto my-5 gap-3'>
        <div className="dashincome w-1/3 bg-[#a5a5a5] px-3 py-5 rounded-md">
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Income</h2>
            <Link href="/dashboard/income"><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
              See Details
            </button></Link>
          </div>
          {/* Render income data here */}
        </div>
        <DashboardExpense />
        <div className="dashcategory w-1/3 bg-[#a5a5a5] px-3 py-5 rounded-md">
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Category</h2>
            <Link href="/dashboard/category"><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
              See Details
            </button></Link>
          </div>
          {/* Render category data here */}
        </div>
      </div>
      {/* Add more dashboard content here */}
    </DashboardLayout>
  );
};

export default Dashboard;
