import React from 'react';
import { useSession } from 'next-auth/react';
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from 'lucide-react';

function DashboardCategory({ categoryData, incomeData, expenseData }) {
    const { data: session } = useSession();
    const currency = session?.user?.currency || '';

    // Helper to calculate total price per category and filter out 0 amount items
    const getCategoryStats = (type, transactions) => {
        return categoryData
            .filter(cat => cat.type === type)
            .map(cat => {
                const totalAmount = transactions.filter(txn => txn.categoryId === cat._id).reduce((sum, txn) => sum + txn.amount, 0);
                return {
                    ...cat,
                    totalAmount: totalAmount,
                };
            })
            .filter(cat => cat.totalAmount !== 0) // Filter out categories with 0 total amount
            .sort((a, b) => b.totalAmount - a.totalAmount);
    };

    const incomeStats = getCategoryStats("income", incomeData);
    const expenseStats = getCategoryStats("expense", expenseData);

    return (
        <div className="border border-black rounded-md p-4 w-[60%] gap-2 csm:w-full">
            <h2 className='text-2xl text-black pb-4'>Categories Breakdown</h2>
            <div className="flex csm:flex-col">

                {/* Expense Categories */}
                <div className="border-r-2 p-4 w-1/2 csm:w-full csm:border-r-0">
                    <h2 className="text-xl text-gray-600 mb-4 flex gap-2 items-center"><BanknoteArrowDownIcon/> Expenses ({expenseStats.length})</h2>
                    {expenseStats.length > 0 ? (
                        expenseStats.map((category) => (
                            <div key={category._id} className="flex items-center justify-between border-b py-2">
                                <p>{category.name}</p>
                                <p>{currency}{new Intl.NumberFormat().format(category.totalAmount)}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-black font-semibold capitalize text-2xl flex justify-center items-center h-[200px]">
                            N/A
                        </div>
                    )}
                </div>

                {/* Income Categories */}
                <div className="p-4 w-1/2 csm:w-full">
                    <h2 className="text-xl text-gray-600 mb-4  flex gap-2 items-center"><BanknoteArrowUpIcon /> Incomes ({incomeStats.length})</h2>
                    {incomeStats.length > 0 ? (
                        incomeStats.map((category) => (
                            <div key={category._id} className="flex items-center justify-between border-b py-2">
                                <p>{category.name}</p>
                                <p>{currency}{new Intl.NumberFormat().format(category.totalAmount)}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-black font-semibold capitalize text-2xl flex justify-center items-center h-[200px]">
                            N/A
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardCategory;
