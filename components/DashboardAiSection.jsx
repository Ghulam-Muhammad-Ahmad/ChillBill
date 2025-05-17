import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import aiImage from '@/public/chatui.svg'; // Assuming the image is in the same directory
import Link from 'next/link';

function DashboardAiSection() {
  return (
    <Link href="/dashboard/aisection" className='border csm:w-full border-black rounded-md p-4 w-[40%] gap-2 hover:bg-secondary hover:text-white cursor-pointer'>
      <div className="">
        <div className="flex items-center gap-3">
          {/* <div className="bg-primary rounded-full p-3">
          </div> */}
          <img src="/chatui.svg" alt="AI Image" className="w-full h-[60%]" />
        </div>
        <h2 className="text-2xl pt-2 font-semibold">ChillBill AI</h2>
        <p className="text-base">
          Get assistance with managing your expenses and income.
        </p>
      </div>
    </Link>
  );
}

export default DashboardAiSection;
