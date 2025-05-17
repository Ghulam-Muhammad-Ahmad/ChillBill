import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowDown, BotIcon, ChartBarStackedIcon, LayoutDashboardIcon, LogOutIcon, Settings2, TrendingUp } from 'lucide-react';

function DashboardHeader() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    if (showConfirm) {
      signOut();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="flex flex-col w-64 h-[100vh] px-2 bg-[#eee] text-black">
      <div className="flex items-center justify-center p-4 ">
        <Image src="/chillbilllogo.png" alt="Flowbite Logo" width={192} height={32} />
      </div>
      <nav className="flex flex-col space-y-4 h-[100%] justify-between py-4 px-2">
       <div className="items flex flex-col gap-2">
        <Link href="/dashboard" legacyBehavior>
        <div className={`flex justify-start items-center text-black hover:bg-secondary hover:text-white gap-2 cursor-pointer p-2 rounded ${router.asPath === '/dashboard' ? 'bg-secondary text-white' : ''}`}>
          <LayoutDashboardIcon/> <a className="">Dashboard</a>
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
         <ArrowDown/> <a className="">Expenses</a>
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
       <div className="actions flex flex-col pb-2">

        <button onClick={handleLogout} className="text-black hover:text-[#ff0101] px-4 py-2 rounded flex gap-2">
         <LogOutIcon /> {showConfirm ? 'Confirm Logout' : 'Logout'}
        </button>
       
          </div>
      </nav>
    </div>
  )
}

export default DashboardHeader