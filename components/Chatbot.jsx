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
        <>
        <h2 className='text-center text-3xl font-bold mt-2'>Ask AI</h2>
        <p className="text-center text-lg text-gray-600 mt-2">
            Welcome to the AI Financial Assistant. Ask any financial question and get insights based on your data.
        </p>
        <div className="flex flex-col max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-lg justify-between mt-3 h-[70vh]">
            <div className="flex flex-col overflow-y-auto mb-4 gap-3">
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`${chat.type === 'user' ? 'flex justify-start items-start gap-1' : ' flex justify-end items-end gap-1'
                            }`}
                    >
                        {chat.type === 'user' ? (
                            <svg width="20" height="20" viewBox="0 0 427 427" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M213.333 426.667C331.157 426.667 426.667 331.157 426.667 213.333C426.667 95.5093 331.157 0 213.333 0C95.5093 0 0 95.5093 0 213.333C0 331.157 95.5093 426.667 213.333 426.667ZM277.333 170.667C277.333 187.641 270.59 203.919 258.588 215.921C246.586 227.924 230.307 234.667 213.333 234.667C196.359 234.667 180.081 227.924 168.078 215.921C156.076 203.919 149.333 187.641 149.333 170.667C149.333 153.693 156.076 137.414 168.078 125.412C180.081 113.409 196.359 106.667 213.333 106.667C230.307 106.667 246.586 113.409 258.588 125.412C270.59 137.414 277.333 153.693 277.333 170.667ZM85.3333 320C100.224 300.115 119.547 283.977 141.767 272.867C163.986 261.757 188.491 255.982 213.333 256C238.176 255.982 262.68 261.757 284.9 272.867C307.12 283.977 326.442 300.115 341.333 320C326.442 339.885 307.12 356.023 284.9 367.133C262.68 378.243 238.176 384.018 213.333 384C188.491 384.018 163.986 378.243 141.767 367.133C119.547 356.023 100.224 339.885 85.3333 320Z" fill="#C82121" />
                            </svg>
                        ) : null}
                        <div dangerouslySetInnerHTML={{ __html: chat.message }} className={`py-1 px-3 w-fit rounded ${chat.type === 'user' ? 'bg-primary text-white ' : 'text-white bg-secondary'
                            }`} />

                        {chat.type === 'bot' ? (
                            <svg width="20" height="20" viewBox="0 0 400 401" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M375 150H366.667V133.333C366.667 87.3833 329.283 50 283.333 50H216.667V16.6667C216.667 7.46667 209.217 0 200 0C190.783 0 183.333 7.46667 183.333 16.6667V50H116.667C70.7167 50 33.3333 87.3833 33.3333 133.333V150H25C11.2167 150 0 161.217 0 175V225C0 238.783 11.2167 250 25 250H33.3333V266.667C33.3333 312.617 70.7167 350 116.667 350H244.95L311 394.033C317 398.033 323.917 400.05 330.85 400.05C336.65 400.05 342.45 398.65 347.767 395.8C359.417 389.55 366.667 377.467 366.667 364.233V249.983H375C388.783 249.983 400 238.767 400 224.983V174.983C400 161.2 388.783 149.983 375 149.983V150ZM141.667 133.333C155.467 133.333 166.667 144.533 166.667 158.333C166.667 172.133 155.467 183.333 141.667 183.333C127.867 183.333 116.667 172.133 116.667 158.333C116.667 144.533 127.867 133.333 141.667 133.333ZM275.517 259.55C258.233 270.4 231.083 283.333 200 283.333C168.917 283.333 141.767 270.4 124.483 259.55C116.683 254.667 114.333 244.367 119.233 236.583C124.133 228.8 134.417 226.433 142.2 231.317C155.783 239.85 176.85 250 200.017 250C223.183 250 244.233 239.85 257.833 231.317C265.6 226.417 275.917 228.783 280.8 236.583C285.7 244.383 283.333 254.667 275.55 259.55H275.517ZM258.333 183.333C244.533 183.333 233.333 172.133 233.333 158.333C233.333 144.533 244.533 133.333 258.333 133.333C272.133 133.333 283.333 144.533 283.333 158.333C283.333 172.133 272.133 183.333 258.333 183.333Z" fill="#38AF79" />
                            </svg>
                        ) : null}
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
        </>
    );
};

export default ChatBot;
