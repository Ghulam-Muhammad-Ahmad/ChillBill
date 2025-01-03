import React, { useState } from 'react';

function Landingfaqs() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <div className='max-w-screen-xl mx-auto my-28'>
      <h2 className='text-center py-3 text-5xl font-semibold px-4' >Frequently Asked Questions</h2>
      <div className='px-3 mb-10 mt-5' >
        {[
          {
            question: "How do I track my expenses?",
            answer: "To track your expenses, simply log into your account, navigate to the 'Expenses' section, and enter the details of your spending."
          },
          {
            question: "Can I categorize my transactions?",
            answer: "Yes, you can categorize your transactions by selecting the appropriate category when you add a new transaction."
          },
          {
            question: "How do I set a budget?",
            answer: "To set a budget, go to the 'Budget' section, choose the category you want to set a budget for, and enter your desired amount."
          }
        ].map((faq, index) => (
          <div key={index}>
            <h2>
              <button
                type="button"
                className={`flex items-center justify-between w-full p-5 font-medium text-gray-500 border-2 border-black dark:text-gray-400  dark:hover:bg-gray-800 ${index === 0 ? 'rounded-t-[12px]' : ''} ${index === 3 ? 'rounded-b-[12px]' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <span >{faq.question}</span>
                <svg
                  className={`w-3 h-3 ${openAccordion === index ? 'rotate-180' : ''} transition-transform`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            {openAccordion === index && (
              <div className="p-5 border-r-2 border-l-2 border-black bg-[#ebfff6]">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landingfaqs;
