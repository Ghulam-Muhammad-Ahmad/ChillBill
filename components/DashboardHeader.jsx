import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

function DashboardHeader() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    if (showConfirm) {
      signOut();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link href="/dashboard">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/chillbilllogo.png" alt="Flowbite Logo" width={192} height={32} />
      </div>
    </Link>
    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
        <Link href="/dashboard/setting" className="flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Image src="/setting.svg" alt="Setting Icon" width={18} height={18} />
            <span className="text-white">Setting</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Image src="/logout.svg" alt="Logout Icon" width={18} height={18} />
            <span className="text-white">{showConfirm ? 'Confirm Logout' : 'Logout'}</span>
        </button>
    </div>
    </div>
  </nav>
  )
}

export default DashboardHeader