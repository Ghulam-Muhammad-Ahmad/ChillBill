import React from 'react'
import Image from 'next/image'

function Landingpagefeatures() {
  return (
   <section id="features" className="my-28 px-6 bg-white">
   <div className="max-w-screen-xl mx-auto text-center">
       <h2 className="text-5xl font-bold mb-8">Our Amazing Features</h2>
       <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           <div className="py-4 px-4 rounded-lg border-black border-2 hoverbordered">
            <Image src="/feature1.png" width={270} height={170} className='w-full' />
               <h3 className="text-3xl font-semibold mb-1 text-start pt-3">Feature 1</h3>
               <p className="text-gray-600 text-start m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
           </div>
           <div className="py-4 px-4 rounded-lg border-black border-2 hoverbordered">
            <Image src="/feature2.png" width={270} height={170} className='w-full' />
               <h3 className="text-3xl font-semibold mb-1 text-start pt-3">Feature 2</h3>
               <p className="text-gray-600 text-start m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
           </div>
           <div className="py-4 px-4 rounded-lg border-black border-2 hoverbordered">
            <Image src="/feature3.png" width={270} height={170} className='w-full' />
               <h3 className="text-3xl font-semibold mb-1 text-start pt-3">Feature 3</h3>
               <p className="text-gray-600 text-start m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
           </div>
       </div>
   </div>
</section>
  )
}

export default Landingpagefeatures