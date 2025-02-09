import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import PasswordInput from './PasswordInput';
function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (res.error) {
            setError(res.error);  // Display error message if login fails
        } else {
            // Redirect to dashboard or home page on successful login
            router.push('/dashboard');  // Change this route as needed
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-fit min-w-[70%]">
            <form onSubmit={handleSubmit} className="mb-5 w-full" autoComplete="on">
                <div className="mb-5 w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>
                <PasswordInput
                    label="Your password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-wrapper-class"
                    inputClassName="custom-input-class"
                    required
                    autoComplete="on"
                // You can even pass custom icons:
                // showIcon={<CustomShowIcon />}
                // hideIcon={<CustomHideIcon />}
                />
                {/* <div className="mb-5 w-full">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="on"
                    />
                </div> */}
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>} {/* Show error message */}
                <div className="my-5 text-black ">
                    Don't have an account?
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600"> Sign up</Link>
                </div>
                <button
                    type="submit"
                    className="text-white bg-primary hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
