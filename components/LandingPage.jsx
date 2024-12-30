import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-teal-500 pt-[90px] text-white min-h-[820px] max-h-fit flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to Our Website</h1>
                <p className="text-xl mb-6">Your journey to greatness starts here. Let us help you grow.</p>
                <Link href="#features">
                    <button className="bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Explore Features</button>
                </Link>
                <Image src="/dashboard-mockup.png" alt="Description of the image" className='mt-5' width={600} height={150} />
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-6 bg-white">
                <div className="max-w-screen-xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Our Amazing Features</h2>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="p-6 shadow-lg rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-semibold mb-4">Feature 1</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="p-6 shadow-lg rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-semibold mb-4">Feature 2</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="p-6 shadow-lg rounded-lg bg-gray-50">
                            <h3 className="text-2xl font-semibold mb-4">Feature 3</h3>
                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-blue-600 text-white py-16 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-lg mb-8">Join us today and start your journey.</p>
                <Link href="#contact">
                    <button className="bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Contact Us</button>
                </Link>
            </section>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white text-center py-4">
                <p>&copy; 2024 My Landing Page. All rights reserved.</p>
            </footer>
        </div>
    );
}
