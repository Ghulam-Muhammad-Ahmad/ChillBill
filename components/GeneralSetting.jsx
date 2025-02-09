import { useSession, signIn } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import PasswordInput from './PasswordInput'; // Import PasswordInput component
function GeneralSetting({ settingstate }) {
  const { data: session } = useSession(); // Get session data
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState('');
  const [password, setPassword] = useState(''); // Added password state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username); // Set initial username from session
      setCurrency(session.user.currency); // Set initial currency from session
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // Make an API request to update user data
      const res = await fetch('/api/auth/generalsetting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session?.user?.email, username, currency, password }), // Added password to the request body
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error); // Display error message if any
      } else {
        // After successful update, re-sign in the user to refresh their session
        const signInResult = await signIn('credentials', {
          email: session?.user?.email,
          password: password, // Use the password from state for re-sign in
        });

        if (signInResult.error) {
          setError(signInResult.error); // Display error message if re-sign in fails
        } else {
          console.log('Username, currency, and password updated successfully!');
        }
      }
    } catch (err) {
      setError('Failed to update settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={settingstate !== 'general' ? 'hidden' : 'shown'}>
      <form
        className="flex justify-center items-center flex-col max-w-[1200px] mx-auto my-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 w-full">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-5 w-full">
          <label
            htmlFor="currency"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Currency
          </label>
          <input
            type="text"
            id="currency"
            value={currency}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
            required
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
        <div className="mb-5 w-full">
          <PasswordInput
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default GeneralSetting;
