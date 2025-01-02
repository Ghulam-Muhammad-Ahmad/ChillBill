import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ChatBot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [genAI, setGenAI] = useState(null);
  const [model, setModel] = useState(null);
  const { data: session } = useSession();
  const [categoryData, setCategoryData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const genAIInstance = new GoogleGenerativeAI("AIzaSyAmD_PHEGt2ckZfg-iGZR9wDes4eyxKU0o");
    const genModel = genAIInstance.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    setGenAI(genAIInstance);
    setModel(genModel);

    const fetchData = async () => {
      try {
        if (!session?.user?.email) {
          console.error("User email is required");
          return;
        }

        const categoryResponse = await axios.get('/api/category', {
          params: { userEmail: session?.user?.email },
        });
        setCategoryData(categoryResponse.data);

        const expenseResponse = await axios.get('/api/expense', {
          params: { userEmail: session?.user?.email },
        });
        const fetchedExpenseData = expenseResponse.data;
        console.log('Fetched Expenses:', fetchedExpenseData); // Debugging
        setExpenseData(fetchedExpenseData);

        const incomeResponse = await axios.get('/api/income', {
          params: { userEmail: session?.user?.email },
        });
        const fetchedIncomeData = incomeResponse.data;
        console.log('Fetched Income:', fetchedIncomeData); // Debugging
        setIncomeData(fetchedIncomeData);

        // Calculate Budget
        const totalIncome = fetchedIncomeData.reduce((sum, item) => {
          console.log(`Adding Income: ${item.amount}`); // Debugging
          return sum + item.amount;
        }, 0);

        const totalExpenses = fetchedExpenseData.reduce((sum, item) => {
          console.log(`Adding Expense: ${item.amount}`); // Debugging
          return sum + item.amount;
        }, 0);

        console.log(`Total Income: ${totalIncome}, Total Expenses: ${totalExpenses}`); // Debugging
        setTotalIncome(totalIncome);
        setTotalExpenses(totalExpenses);
        setBudget(totalIncome - totalExpenses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [session?.user?.email]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { type: 'user', message: userInput };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      // Create a compiled instruction from your data
      const compiledData = `You are a financial assistant who provides an overview of the user's financial data. Below is a summary of the user's income, expenses, and budget:- **Categories:**${Array.isArray(categoryData) && categoryData.map(category => `  1. **${category.name} (${category.type})`).join("\n")} - **Income:** ${Array.isArray(incomeData) && incomeData.map(income => `  1. **${categoryData.find(c => c._id === income.categoryId)?.name}**: ${income.amount} from "${income.note || 'N/A'}"`).join("\n")} - **Expenses:**${Array.isArray(expenseData) && expenseData.map(expense => `  1. **${categoryData.find(c => c._id === expense.categoryId)?.name}**: ${expense.amount} for "${expense.description || 'N/A'}"`).join("\n")}- **Budget Overview:**  The total income is ${totalIncome}, and the total expenses are ${totalExpenses}. The remaining budget after expenses is **${budget}**.Please provide insights or suggestions based on this financial data.`;
      console.log(compiledData);

      // Ensure the input is an array of content objects
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `my question is ${userInput}. Answer this question only. this is just data to use: ${compiledData}. Donot go outside the topic if user go then said i am only financial assisstant bot.`,
              }
            ],
          }
        ]
      });

      function formatGeminiResponseToHTML(responseText) {
        // Assuming responseText contains plain text
        // You can enhance this logic based on your actual Gemini response structure
        
        // For example, you can replace certain text patterns with HTML tags
        const formattedResponse = responseText
          .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')  // Bold for **bold text**
          .replace(/(__[^_]+__)/g, '<i>$1</i>')    // Italics for __italic text__
          .replace(/(?:\r\n|\r|\n)/g, '<br>');      // Line breaks for newlines
      
        return formattedResponse;
      }

      const botMessage = {
        type: 'bot',
        message: formatGeminiResponseToHTML(result.response.text()),
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }

    setUserInput('');
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex-1 overflow-y-auto mb-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              chat.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
            }`}
          >
                <div dangerouslySetInnerHTML={{ __html: chat.message }} />
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          className="flex-1 p-2 border border-gray-300 rounded-l"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
