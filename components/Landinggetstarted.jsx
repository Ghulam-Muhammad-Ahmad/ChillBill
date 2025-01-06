import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

function Landinggetstarted() {
  return (
    <section className=" max-w-screen-xl mx-auto csm:flex-col border-black border-2 rounded-[12px] text-black overflow-hidden hoverbordered text-center flex py-5 px-6 justify-center items-center ">
        <div className="text-start flex gap-2 flex-col">
    <h2 className="text-3xl  font-bold ">Ready to Get Started?</h2>
    <p className="text-lg">Join us today and start your journey. Whether you are looking to improve your skills, connect with like-minded individuals, or simply explore new opportunities, we have something for everyone. Don't wait any longer, take the first step towards a brighter future with us.</p>
    <Link href="#contact">
        <button className="text-white bg-primary hover:bg-secondary focus:outline-none font-bold uppercase text-base px-[28px] py-[10px] rounded-[12px] border-2 border-black text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ boxShadow: '4px 4px 0 0 #000', transition: 'box-shadow 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'none'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'}>Contact Us</button>
    </Link>
        </div>
        <div className="mt-[-50px] mb-[-60px]">
            <Image src='/Investing-bro.svg' width={850} height={550} alt='Get Started' />
        </div>
</section>
  )
}

export default Landinggetstarted