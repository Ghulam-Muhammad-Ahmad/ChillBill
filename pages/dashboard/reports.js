import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import TransactionPdf from '@/components/TransactionPdf';
import { MonthContext } from '@/context/monthContext';

const Reports = () => {
  const { data: session } = useSession();
  const { monthNumber } = useContext(MonthContext);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currency = session?.user?.currency || '₹';

  useEffect(() => {
    document.title = 'Reports | ChillBill';
  }, []);

  const handleGenerateReport = () => {
    if (startDate && endDate && session?.user?.email) {
      setShowReport(true);
      fetchData();
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [incomeRes, expenseRes, categoryRes] = await Promise.all([
        axios.get('/api/income', {
          params: {
            userEmail: session.user.email,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
          },
        }),
        axios.get('/api/expense', {
          params: {
            userEmail: session.user.email,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
          },
        }),
        axios.get('/api/category', {
          params: { userEmail: session.user.email },
        }),
      ]);

      setIncome(incomeRes.data);
      setExpenses(expenseRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error('Error loading report data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (id) => categories.find((c) => c._id === id)?.name || 'Unknown';

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const groupAndSum = (data, key) =>
    data.reduce((acc, curr) => {
      acc[curr[key]] = (acc[curr[key]] || 0) + curr.amount;
      return acc;
    }, {});

  const incomeBySource = groupAndSum(income, 'categoryId');
  const expensesByCategory = groupAndSum(expenses, 'categoryId');

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Financial Reports</h1>

        {/* Date Filters */}
        <div className="flex flex-wrap gap-4 justify-center items-end">
          <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
          <DateInput label="End Date" value={endDate} onChange={setEndDate} />
          <button
            onClick={handleGenerateReport}
            className="ml-2 bg-primary hover:bg-secondary text-white py-2 px-4 rounded csm:ml-0 w-fit"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {showReport && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReportCard title="Total Income" value={totalIncome} color="green" currency={currency} />
              <ReportCard title="Total Expenses" value={totalExpenses} color="red" currency={currency} />
              <ReportCard title="Net Savings" value={totalIncome - totalExpenses} color="blue" currency={currency} />
            </div>

            {/* PDF Export */}
            <TransactionPdf
              heading={`All Transactions (${startDate} to ${endDate})`}
              transactions={[
                ...income.map((i) => ({ ...i, category: getCategoryName(i.categoryId), type: 'Income' })),
                ...expenses.map((e) => ({ ...e, category: getCategoryName(e.categoryId), type: 'Expense' })),
              ]}
              currency={currency}
            />

            {/* Breakdown Sections */}
            <Section title="Income by Source">
              {Object.entries(incomeBySource).map(([id, amount]) => (
                <StatRow key={id} label={getCategoryName(id)} value={amount} currency={currency} />
              ))}
            </Section>

            <Section title="Expenses by Category">
              {Object.entries(expensesByCategory).map(([id, amount]) => (
                <StatRow key={id} label={getCategoryName(id)} value={amount} currency={currency} />
              ))}
            </Section>

            <Section title="Top Expense Categories">
              {[...Object.entries(expensesByCategory)]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id, amount]) => (
                  <StatRow key={id} label={getCategoryName(id)} value={amount} currency={currency} />
                ))}
            </Section>

            <Section title="Cash Flow Summary">
              <StatRow label="Inflow (Income)" value={totalIncome} currency={currency} />
              <StatRow label="Outflow (Expenses)" value={totalExpenses} currency={currency} />
              <StatRow label="Net Flow" value={totalIncome - totalExpenses} currency={currency} />
            </Section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

// COMPONENTS

const ReportCard = ({ title, value, color, currency }) => (
  <div className={`p-6 rounded-2xl shadow bg-${color}-100 hover:shadow-lg transition`}>
    <h3 className="text-md font-semibold text-gray-700 mb-1">{title}</h3>
    <p className={`text-2xl font-bold text-${color}-800`}>
      {currency} {value.toLocaleString()}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

const StatRow = ({ label, value, currency }) => (
  <div className="flex justify-between items-center py-2 px-4 bg-white border rounded-md shadow-sm hover:bg-gray-50">
    <span className="text-gray-700">{label}</span>
    <span className="font-medium text-gray-900">{currency} {value.toLocaleString()}</span>
  </div>
);

const DateInput = ({ label, value, onChange }) => (
  <div className="flex flex-col w-1/4 csm:w-full">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Reports;
