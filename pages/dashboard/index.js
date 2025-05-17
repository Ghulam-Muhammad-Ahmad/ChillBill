'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import DashboardExpense from '@/components/DashboardExpense';
import axios from 'axios';
import DashboardIncome from '@/components/DashboardIncome';
import { MonthContext } from '@/context/monthContext';
import Spinner from '@/components/Spinner';
import DashboardLeadingdash from '@/components/DashboardLeadingdash';
import DashboardExpensesChart from '@/components/DashboardExpensesChart';
import DashboardCategory from '@/components/DashboardCategory';
import DashboardAiSection from '@/components/DashboardAiSection';

const Dashboard = () => {
  const { monthNumber } = useContext(MonthContext);
  const { data: session } = useSession();

  const [categoryData, setCategoryData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');

  useEffect(() => {
    if (!session?.user?.email) return;

    const startDate =
      monthNumber === -1
        ? '0'
        : new Date(new Date().getFullYear(), monthNumber - 1, 1).toISOString();
    const endDate =
      monthNumber === -1
        ? '0'
        : new Date(new Date().getFullYear(), monthNumber, 0).toISOString();

    const fetchData = async () => {
      try {
        setLoadingText('Loading Categories...');
        const categoryResponse = await axios.get('/api/category', {
          params: { userEmail: session.user.email },
        });
        setCategoryData(categoryResponse.data);

        setLoadingText('Loading Expenses...');
        const expenseResponse = await axios.get('/api/expense', {
          params: {
            userEmail: session.user.email,
            startDate,
            endDate,
            allData: monthNumber === -1,
          },
        });
        const fetchedExpenseData = expenseResponse.data;
        setExpenseData(fetchedExpenseData);

        setLoadingText('Loading Incomes...');
        const incomeResponse = await axios.get('/api/income', {
          params: {
            userEmail: session.user.email,
            startDate,
            endDate,
            allData: monthNumber === -1,
          },
        });
        const fetchedIncomeData = incomeResponse.data;
        setIncomeData(fetchedIncomeData);

        setLoadingText('Calculating Budget...');
        const totalIncome = fetchedIncomeData.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = fetchedExpenseData.reduce((sum, item) => sum + item.amount, 0);
        setTotalIncome(totalIncome);
        setTotalExpenses(totalExpenses);
        setBudget(totalIncome - totalExpenses);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    document.title = 'Dashboard | ChillBill';
  }, [session?.user?.email, monthNumber]);

  if (isLoading) {
    return <Spinner loadingText={loadingText} />;
  }

  return (
    <DashboardLayout>
      <DashboardLeadingdash totalIncome={totalIncome} totalExpenses={totalExpenses} budget={budget} />
      <DashboardExpensesChart expenseData={expenseData} categoryData={categoryData}  />
      <div className="flex gap-4 pt-4 csm:flex-wrap csm:pb-4">
        {/* <DashboardIncome incomeData={incomeData} categoryData={categoryData} /> */}
        {/* <DashboardExpense expenseData={expenseData} categoryData={categoryData} /> */}
        <DashboardCategory categoryData={categoryData} incomeData={incomeData} expenseData={expenseData} />
        <DashboardAiSection />
      </div>
     
    </DashboardLayout>
  );
};

export default Dashboard;
