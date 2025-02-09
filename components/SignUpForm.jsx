import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PasswordInput from './PasswordInput';

function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username, currency }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      // Redirect or show success message
      console.log('User registered successfully!');

      router.push('/login');
    }
  };

  return (
    <form className="flex justify-center items-center flex-col w-fit min-w-[70%]" onSubmit={handleSubmit}>
      <div className="mb-5 w-full">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input
          type="email"
          id="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-5 w-full">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
        <input
          type="text"
          id="username"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-5 w-full">
        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your currency symbol</label>
        <input
          type="text"
          id="currency"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
          maxLength="5"
          required
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
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
        <PasswordInput
        label="Repeat password"
        id="repeat-password"
        name="repeat-password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        className="custom-wrapper-class"
        inputClassName="custom-input-class"
        required
        autoComplete="on"
      // You can even pass custom icons:
      // showIcon={<CustomShowIcon />}
      // hideIcon={<CustomHideIcon />}
      />
      
      <div className="flex items-start mb-5 w-full">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            required
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
        </div>
        <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I agree with the{' '}
          <a href="#" className="text-secondary hover:underline hover:text-primary dark:text-secondary">
            terms and conditions
          </a>
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="my-5 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
      <button
        type="submit"
        className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register new account'}
      </button>
    </form>
  );
}

export default SignUpForm;
