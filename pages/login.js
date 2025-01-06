"use client"
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function login() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      }
    };

    checkSession();
  }, [router]);

  return (
    <section className="h-screen flex">
      <div className="loginform flex justify-center items-center flex-col px-8 w-[60%] csm:w-full csm:bg-[#c821213f]" >
                        <h2 className="text-center font-bold text-3xl">Login</h2>
                        <p className="text-center w-3/4 text-md pb-5">Manage your finances effectively with our budget management project.</p>
                        <LoginForm />
                    </div>
                    <div className="loginimg bg-primary w-[40%] flex justify-center items-center csm:hidden">
                        <Image src="/adult-having-lots-money.jpg" alt="login Vector" width={500} height={500} className="w-full h-full object-cover" />
                    </div>
                    
                </section>
  )
}
