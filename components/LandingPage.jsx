"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LandingpageMarquee from './LandingpageMarquee';
import Landingpagefeatures from './Landingpagefeatures';
import Landinggetstarted from './Landinggetstarted';
import Landinghowworks from './Landinghowworks';
import Landingfaqs from './Landingfaqs';
import 'flowbite';
import Landingcontact from './Landingcontact';

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

export default function LandingPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="border-b-2 border-black">
                <div className="pt-[110px] pb-[0px] csm:py-4 csm:px-2 csm:flex-col text-black max-h-fit  flex items-center justify-center text-center max-w-screen-xl mx-auto">
                    <div className="text-black w-1/2 flex justify-start flex-col pb-8 csm:w-full">
                        <h1 className="text-6xl font-bold mb-4 text-start">Track. Categorize. <br></br> Save. Simplify</h1>
                        <p className="text-2xl mb-6 text-start">Your journey to greatness starts here. <br></br> Let us help you grow.</p>
                        <Link href="/signup" className="text-white w-fit bg-primary hover:bg-secondary focus:outline-none font-bold uppercase text-base px-[28px] py-[10px] rounded-[12px] border-2 border-black text-start dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ boxShadow: '4px 4px 0 0 #000', transition: 'box-shadow 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'none'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'}>Take Control Today</Link>
                    </div>
                    <div className="w-1/2 csm:w-full">
                        <Lottie
                            loop
                            animationData={require('../public/lottie/moneytrack.json')} // Ensure the correct relative path
                            play
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </section>
            <LandingpageMarquee />
            <Landingpagefeatures />
            <Landinggetstarted />
            <Landinghowworks />
            <Landingcontact />
            <Landingfaqs />

            {/* Footer Section */}
            <footer className="bg-secondary text-white text-center py-4">
                <p>&copy; {new Date().getFullYear()} ChillBill. All rights reserved.</p>
            </footer>
        </div>
    );
}
