"use client"
import SignUpForm from "@/components/SignUpForm";
import Image from "next/image";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function Signup() {
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
        <>
            <section className="h-screen flex">
                <div className="signupimg bg-secondary w-[50%] flex justify-center items-center">
                    <Image src="/signupvector.svg" alt="Signup Vector" width={500} height={500} />
                </div>
                <div className="signupform flex justify-center items-center flex-col px-8 w-[50%]" >
                    <h2 className="text-center font-bold text-3xl">Create A Account</h2>
                    <p className="text-center w-3/4 text-md pb-5">Manage your finances effectively with our budget management project.</p>
                    <SignUpForm />
                </div>
            </section>
        </>
    )
}
