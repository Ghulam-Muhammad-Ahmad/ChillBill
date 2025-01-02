import React, { useState } from 'react';
import { useSession } from 'next-auth/react'; // Updated import

function ResetPasswordForm({settingstate}) {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession(); // Updated usage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: session.user.email, newPassword: password }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      // Show success message
      console.log('Password reset successfully!');
    }
  };

  return (
    <div className={settingstate != "password" ? "hidden" : "shown"}>
    <form className="flex justify-center items-center flex-col max-w-[1200px] mx-auto my-5" onSubmit={handleSubmit}>
      <div className="mb-5 w-full">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
        <input
          type="password"
          id="password"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-5 w-full">
        <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat new password</label>
        <input
          type="password"
          id="repeat-password"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary dark:shadow-sm-light"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        type="submit"
        className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        disabled={loading}
      >
        {loading ? 'Resetting...' : 'Reset password'}
      </button>
    </form>
    </div>

  );
}

export default ResetPasswordForm;
