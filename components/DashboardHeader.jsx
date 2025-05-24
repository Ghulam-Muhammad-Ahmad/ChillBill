import { MonthContext } from '@/context/monthContext';
import React, { useContext, useState } from 'react';
import { Menu, X } from 'lucide-react'; // Hamburger & close icons
import Link from 'next/link';
import { ArrowDown, BotIcon, ChartBarStackedIcon, LayoutDashboardIcon, LogOutIcon, Settings2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';

function DashboardHeader() {
  const { monthNumber, updateMonthNumber } = useContext(MonthContext);
  const [selectedMonth, setSelectedMonth] = useState(monthNumber);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleFilterClick = () => {
    updateMonthNumber(selectedMonth);
    setIsMenuOpen(false); // close menu after filtering (optional)
  };

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="flex items-center justify-between pb-4 px-2 border-b-2 max-h-[15vh] csm:max-h-full csm:flex-col">
      <div className="flex justify-between w-full items-center csm:mb-2">
        <h1 className="text-2xl font-semibold capitalize">
          {document.title.split('|')[0]}
        </h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="hidden csm:block"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`flex items-center gap-2 w-full justify-end csm:w-full csm:items-start csm:transition-all csm:flex-col csm:duration-300 ${isMenuOpen ? 'csm:flex' : 'csm:hidden'
          }`}
      >
        <div className="menuinheader hidden csm:flex csm:flex-col csm:w-full gap-2">
          <Link href="/dashboard" legacyBehavior className='w-full'>
            <div className={`flex w-full justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard' ? 'bg-secondary text-white' : ''}`}>
              <LayoutDashboardIcon /> <a className="">Dashboard</a>
            </div>
          </Link>

          <Link href="/dashboard/category" legacyBehavior>
            <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard/category' ? 'bg-secondary text-white' : ''}`}>
              <ChartBarStackedIcon /> <a className="">Categories</a>
            </div>
          </Link>
          <Link href="/dashboard/income" legacyBehavior>
            <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard/income' ? 'bg-secondary text-white' : ''}`}>
              <TrendingUp /> <a className="">Income</a>
            </div>
          </Link>
          <Link href="/dashboard/expense" legacyBehavior>
            <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard/expense' ? 'bg-secondary text-white' : ''}`}>
              <ArrowDown /> <a className="">Expenses</a>
            </div>
          </Link>
          <Link href="/dashboard/aisection" legacyBehavior>
            <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard/aisection' ? 'bg-secondary text-white' : ''}`}>
              <BotIcon /> <a className="">AI Chat</a>
            </div>
          </Link>
          <Link href="/dashboard/setting" legacyBehavior>
            <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard/setting' ? 'bg-secondary text-white' : ''}`}>
              <Settings2 /><a className="">Setting</a>
            </div>
          </Link>
        </div>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="bg-transparent text-black p-2 min-w-[250px] csm:w-full rounded"
        >
          <option value="" disabled>
            Select Month
          </option>
          <option value="-1">All Data</option>
          {Array.from({ length: currentMonth }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(2022, month - 1, 1).toLocaleString('default', {
                month: 'long',
              })}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilterClick}
          className="ml-2 bg-primary hover:bg-secondary text-white py-2 px-4 rounded csm:ml-0 w-fit"
        >
          Filter Data
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
