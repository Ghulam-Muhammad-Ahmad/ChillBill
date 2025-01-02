"use client"
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardExpense from '@/components/DashboardExpense';
import axios from 'axios';
import DashboardIncome from '@/components/DashboardIncome';

const Dashboard = () => {
  const [daterange, setDaterange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 0, 1).toISOString()
  });

  const [categoryData, setCategoryData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [budget, setBudget] = useState(0);
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
          const fetchedExpenseData = expenseResponse.data;
          console.log('Fetched Expenses:', fetchedExpenseData); // Debugging
          setExpenseData(fetchedExpenseData);

          const incomeResponse = await axios.get('/api/income', {
            params: { userEmail: session?.user?.email },
          });
          const fetchedIncomeData = incomeResponse.data;
          console.log('Fetched Income:', fetchedIncomeData); // Debugging
          setIncomeData(fetchedIncomeData);

          // Calculate Budget
          const totalIncome = fetchedIncomeData.reduce((sum, item) => {
            console.log(`Adding Income: ${item.amount}`); // Debugging
            return sum + item.amount;
          }, 0);

          const totalExpenses = fetchedExpenseData.reduce((sum, item) => {
            console.log(`Adding Expense: ${item.amount}`); // Debugging
            return sum + item.amount;
          }, 0);

          console.log(`Total Income: ${totalIncome}, Total Expenses: ${totalExpenses}`); // Debugging
          setBudget(totalIncome - totalExpenses);
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
      <div className='flex justify-center items-stretch max-w-[1200px] mx-auto my-5 gap-3'>
        <DashboardIncome incomeData={incomeData} categoryData={categoryData} />
        <DashboardExpense expenseData={expenseData} categoryData={categoryData} />
        <div className="dashcategory w-1/3 bg-[#a5a5a5] px-3 py-5 rounded-md">
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Category ({categoryData.length})</h2>
            <Link href="/dashboard/category"><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
              See Details
            </button></Link>
          </div>
          {categoryData.map((category, index) => (
            <div key={index} className='flex items-center justify-between'>
              <p>{category.name}</p>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center my-5 text-xl font-bold flex justify-center items-center flex-col'>
       <div> Your Budget is: <span className={budget >= 0 ? 'text-green-500' : 'text-red-500'}>{session?.user?.currency} {new Intl.NumberFormat().format(budget)}</span></div>
        <Link href='/dashboard/aisection'><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
          Ask AI
        </button></Link>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
