import Image from 'next/image'
import React from 'react'

function Landinghowworks() {
  return (
    <div className='max-w-screen-xl mx-auto my-28'>
    <h2 className="text-5xl font-bold">Actually How It Works!</h2>
    <p className="text-lg mt-4 w-1/2">Our platform simplifies the process of tracking, categorizing, and saving your financial data. With our intuitive interface, you can easily monitor your expenses, set budget goals, and gain insights into your spending habits.</p>
<div className="flex justify-between mt-10 items-start cardmain">
<div className="card w-fit flex justify-center items-center flex-col gap-3">
    <div className="iconitem hoverbordered p-5 border-black border-2 rounded-2xl shadow-lg">
        <Image src="/step1.png" width={100} height={100} alt='howtoworks' />
    </div>
        <h2 className='text-center text-3xl font-bold'>Signup / Login</h2>
</div>
<div className="card w-fit flex justify-center items-center flex-col gap-3">
    <div className="iconitem hoverbordered p-5 border-black border-2 rounded-2xl shadow-lg">
        <Image src="/step2.png" width={100} height={100} alt='howtoworks' />
    </div>
        <h2 className='text-center text-3xl font-bold'>Add Income <br></br>& Expense</h2>
</div>
<div className="card w-fit flex justify-center items-center flex-col gap-3">
    <div className="iconitem hoverbordered p-5 border-black border-2 rounded-2xl shadow-lg">
        <Image src="/step3.png" width={100} height={100} alt='howtoworks' />
    </div>
        <h2 className='text-center text-3xl font-bold'>Categorize Items</h2>
</div>
<div className="cardlast w-fit flex justify-center items-center flex-col gap-3">
    <div className="iconitem hoverbordered p-5 border-black border-2 rounded-2xl shadow-lg">
        <Image src="/step4.png" width={100} height={100} alt='howtoworks' />
    </div>
        <h2 className='text-center text-3xl font-bold'>Ask AI</h2>
</div>
</div>
    </div>
  )
}

export default Landinghowworks