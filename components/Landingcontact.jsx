import React, { useState } from 'react';
import axios from 'axios';

function Landingcontact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contactus', { name, email, message });
      setSuccess('Message sent successfully!');
      setError(null);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setError('Error sending message. Please try again.');
      setSuccess(null);
      console.error(error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto my-28" id='contact'>
      <h2 className="text-center py-3 text-5xl font-semibold px-4">Get in Touch</h2>
      <form onSubmit={handleSubmit} className="px-3 mb-10 mt-5">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:outline-none focus:ring-blue-500 focus:border-secondary sm:text-sm" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:outline-none focus:ring-blue-500 focus:border-secondary sm:text-sm" />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" name="message" rows="3" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:outline-none focus:border-secondary sm:text-sm"></textarea>
        </div>
        <button type="submit" className="text-white w-fit bg-primary hover:bg-secondary focus:outline-none font-bold uppercase text-base px-[28px] py-[10px] rounded-[12px] border-2 border-black text-start dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ boxShadow: '4px 4px 0 0 #000', transition: 'box-shadow 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'none'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '4px 4px 0 0 #000'}>Send</button>
      </form>
    </div>
  )
}

export default Landingcontact;