import Image from 'next/image';
import Link from 'next/link';
function Header() {
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b-2 border-black dark:border-gray-600 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-stretch justify-between mx-auto ">
        <Link href="/" className='border-black border-r-2 pr-5 py-3'>
          <div className="flex items-center space-x-3 rtl:space-x-reverse ">
            <Image src="/chillbilllogo.png" alt="Flowbite Logo" width={192} height={32} />
          </div>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2 border-black border-l-2 justify-start items-center pl-5">
          <Link href="/login" className="text-white bg-primary hover:bg-secondary focus:outline-none font-bold uppercase text-base px-[28px] py-[10px] rounded-[12px] border-2 border-black text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ boxShadow: '4px 4px 0 0 #000', transition: 'box-shadow 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'none'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'}>Login</Link>
          <Link href="/signup" className="text-white bg-primary hover:bg-secondary focus:outline-none font-bold uppercase text-base px-[28px] py-[10px] rounded-[12px] border-2 border-black text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ boxShadow: '4px 4px 0 0 #000', transition: 'box-shadow 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'none'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'}>SignUp</Link>
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false" style={{ boxShadow: '4px 4px 0 0 var(--black22)' }}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto py-3 md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-semibold uppercase text-base border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ">
            <li>
              <Link href="/" className="block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0 md:dark:text-primary" aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-secondary md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-secondary dark:text-white dark:hover:bg-secondary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
            </li>
            <li>
              <Link href="/services" className="block py-2 px-3 text-gray-900 rounded hover:bg-secondary md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-secondary dark:text-white dark:hover:bg-secondary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-secondary md:hover:bg-transparent md:hover:text-secondary md:p-0 md:dark:hover:text-secondary dark:text-white dark:hover:bg-secondary dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header