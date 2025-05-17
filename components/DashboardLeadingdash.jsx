import React from 'react';
import { useSession } from 'next-auth/react';

function DashboardLeadingdash({ totalIncome, totalExpenses, budget }) {
  const { data: session } = useSession();
  const currency = session?.user?.currency || '$';

  const DashCard = ({ label, value, wide = false }) => (
    <div
      className={`border border-black rounded-md p-4 ${
        wide ? 'w-[40%] csm:w-[100%]' : 'w-[29%] csm:w-[47%]'
      } text-start`}
    >
      <p className="text-lg csm:text-base text-gray-600">{label}</p>
      <p className="text-4xl csm:text-xl font-bold">
        {currency}{new Intl.NumberFormat().format(value)}
      </p>
    </div>
  );

  return (
    <div className="flex justify-center gap-4 mt-4 csm:flex-wrap">
      <DashCard label="Total Income" value={totalIncome} />
      <DashCard label="Total Expenses" value={totalExpenses} />
      <DashCard label="Net Balance" value={budget} wide />
    </div>
  );
}

export default DashboardLeadingdash;
