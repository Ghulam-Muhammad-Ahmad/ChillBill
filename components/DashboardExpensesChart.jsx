import React from 'react'
import { useSession } from 'next-auth/react'
import PieChartComponent from './PieChart';
import BarChart from './BarChart';

function DashboardExpensesChart({ expenseData, categoryData }) {
    const { data: session } = useSession();
    expenseData.forEach(expense => {
        const categoryName = categoryData.find(category => category._id === expense.categoryId)?.name || 'Unknown Category';
        expense.categoryName = categoryName;
    });
    return (
        <div className='flex gap-4 h-[50vh] pt-4 w-full csm:h-fit csm:flex-wrap'>
            <div className="flex flex-col border border-black rounded-md p-4 w-1/2 csm:w-full">
                <h2 className='text-2xl text-black pb-4'>Expenses</h2>
                <BarChart data={expenseData} currency={session?.user?.currency} />
            </div>
            <div className="flex flex-col border border-black rounded-md p-4 w-1/2 csm:w-full csm:h-auto">
            <h2 className='text-2xl text-black pb-4'>Expenses Breakdown</h2>
                <PieChartComponent data={expenseData} currency={session?.user?.currency} />
            </div>
        </div>
    )
}

export default DashboardExpensesChart