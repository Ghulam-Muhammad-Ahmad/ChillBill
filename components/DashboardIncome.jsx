import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios';
import DoughnutChart from './DoughnutChart';

function DashboardIncome({incomeData, categoryData}) {
    const {data: session} = useSession();
    incomeData.forEach(income => {
    const categoryName = categoryData.find(category => category._id === income.categoryId)?.name || 'Unknown Category';
    income.categoryName = categoryName;
    });
  return (
    <div className="dashincome w-1/3 csm:w-full bg-[#a5a5a5] px-3 py-5 rounded-md">
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-semibold'>Income <br></br> {session?.user?.currency} {new Intl.NumberFormat().format(incomeData.reduce((total, item) => total + item.amount, 0))}</h2>
      <Link href="/dashboard/income"><button className='flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white'>
        See Details
      </button></Link>
    </div>
   <DoughnutChart data={incomeData} currency={session?.user?.currency} />
  </div>
  )
}

export default DashboardIncome