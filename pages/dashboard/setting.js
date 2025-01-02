"use client"
import DashboardLayout from '@/components/DashboardLayout';
import GeneralSetting from '@/components/GeneralSetting';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import Link from 'next/link';
import { useState, useEffect } from 'react';
const Setting = () => {
  const [settingstate, setsettingstate] = useState("general");

  useEffect(() => {
    document.title = "Settings | ChillBill";
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto my-5">
          <h1 className="text-3xl font-bold">Account Setting</h1>
          <Link href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg width="18" height="18" viewBox="0 0 382 336" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M103.881 176C100.207 175.993 96.6479 174.721 93.8009 172.4L6.92086 100.64C5.28743 99.3089 3.93294 97.6685 2.93516 95.8128C1.93738 93.9571 1.31595 91.9225 1.10656 89.826C0.897159 87.7294 1.10391 85.6121 1.71495 83.5957C2.32599 81.5793 3.32929 79.7034 4.66723 78.0757C6.00518 76.4481 7.65142 75.1007 9.51147 74.111C11.3715 73.1212 13.4087 72.5086 15.5062 72.3083C17.6036 72.108 19.72 72.3239 21.7337 72.9437C23.7475 73.5634 25.619 74.5748 27.2409 75.9198L114.121 147.36C117.381 150.059 119.439 153.94 119.844 158.154C120.249 162.367 118.968 166.569 116.281 169.84C114.807 171.73 112.928 173.264 110.782 174.331C108.635 175.397 106.277 175.967 103.881 176Z" fill="white" />
              <path d="M16.9999 104C13.693 104.01 10.4643 102.995 7.75782 101.095C5.05133 99.1951 3.00007 96.5031 1.88618 93.3895C0.772298 90.2758 0.650527 86.8936 1.53761 83.7079C2.42469 80.5223 4.27705 77.6897 6.83988 75.5999L93.7999 4.55992C97.0803 1.8871 101.286 0.622594 105.496 1.04313C109.707 1.46366 113.579 3.53499 116.266 6.80382C118.953 10.0727 120.236 14.2728 119.834 18.4851C119.432 22.6974 117.377 26.5788 114.12 29.2799L27.2399 100.64C24.3178 102.91 20.6991 104.098 16.9999 104Z" fill="white" />
              <path d="M253.56 335.12H17C12.7565 335.12 8.68688 333.434 5.68629 330.434C2.68571 327.433 1 323.363 1 319.12C1 314.876 2.68571 310.807 5.68629 307.806C8.68688 304.806 12.7565 303.12 17 303.12H253.56C279.434 302.386 304.003 291.591 322.045 273.03C340.086 254.469 350.18 229.605 350.18 203.72C350.18 177.835 340.086 152.97 322.045 134.409C304.003 115.848 279.434 105.054 253.56 104.32H17C12.7565 104.32 8.68688 102.634 5.68629 99.6335C2.68571 96.6329 1 92.5633 1 88.3198C1 84.0764 2.68571 80.0067 5.68629 77.0061C8.68688 74.0055 12.7565 72.3198 17 72.3198H253.56C287.848 73.1659 320.447 87.3812 344.399 111.931C368.351 136.481 381.758 169.421 381.758 203.72C381.758 238.018 368.351 270.958 344.399 295.508C320.447 320.058 287.848 334.274 253.56 335.12Z" fill="white" />
            </svg>
            <span className="text-white">Go Back</span>
          </Link>
        </div>
        <div className='flex max-w-[1200px] mx-auto my-5 gap-5'>
          <div className='flex flex-col justify-start items-start text-center w-1/3'>
            <h2 className='text-2xl font-semibold mb-2'>
              Setting
            </h2>
            <button className={`px-3 py-2 mb-2 rounded-lg ${settingstate === "general" ? "bg-[#dddddd]" : "hover:bg-[#dddddd]"} w-full text-start`} onClick={() => { setsettingstate("general") }} >General</button>
            <button className={`px-3 py-2 rounded-lg ${settingstate === "password" ? "bg-[#dddddd]" : "hover:bg-[#dddddd]"} w-full text-start`} onClick={() => { setsettingstate("password") }}>Change Password</button>
          </div>
          <div className='w-full'>
          <ResetPasswordForm settingstate={settingstate} />
          <GeneralSetting settingstate={settingstate} />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Setting;
