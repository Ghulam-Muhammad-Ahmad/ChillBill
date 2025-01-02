import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios';
import DoughnutChart from './DoughnutChart';

function DashboardExpense({expenseData, categoryData}) {
    const {data: session} = useSession();
    expenseData.forEach(expense => {
    const categoryName = categoryData.find(category => category._id === expense.categoryId)?.name || 'Unknown Category';
    expense.categoryName = categoryName;
    });
  return (
    <div className="dashexpense w-1/3 bg-[#a5a5a5] px-3 py-5 rounded-md">
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-semibold'>Expense <br></br> {session?.user?.currency} {new Intl.NumberFormat().format(expenseData.reduce((total, item) => total + item.amount, 0))}</h2>
      <Link href="/dashboard/expense"><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
        See Details
      </button></Link>
    </div>
   <DoughnutChart data={expenseData} currency={session?.user?.currency} />
  </div>
  )
}

export default DashboardExpense