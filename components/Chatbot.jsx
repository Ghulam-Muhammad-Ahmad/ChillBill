import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import dotenv from 'dotenv';
dotenv.config();


const ChatBot = () => {
    const { data: session } = useSession();
    const [chatHistory, setChatHistory] = useState([]);
    const [genAI, setGenAI] = useState(null);
    const [model, setModel] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [budget, setBudget] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        console.log('API Key:', process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const genAIInstance = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const genModel = genAIInstance.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        setGenAI(genAIInstance);
        setModel(genModel);

        const fetchData = async () => {
            try {
                if (!session?.user?.email) {
                    console.error("User email is required");
                    return;
                }

                // Fetch categories
                const categoryResponse = await axios.get('/api/category', {
                    params: { userEmail: session?.user?.email },
                });
                setCategoryData(categoryResponse.data);

                // Fetch expenses
                const expenseResponse = await axios.get('/api/expense', {
                    params: { userEmail: session?.user?.email },
                });
                const fetchedExpenseData = expenseResponse.data;
                setExpenseData(fetchedExpenseData);

                // Fetch income
                const incomeResponse = await axios.get('/api/income', {
                    params: { userEmail: session?.user?.email },
                });
                const fetchedIncomeData = incomeResponse.data;
                setIncomeData(fetchedIncomeData);

                // Calculate budget
                const totalIncome = fetchedIncomeData.reduce((sum, item) => sum + item.amount, 0);
                const totalExpenses = fetchedExpenseData.reduce((sum, item) => sum + item.amount, 0);
                setTotalIncome(totalIncome);
                setTotalExpenses(totalExpenses);
                setBudget(totalIncome - totalExpenses);
                // Fetch chat messages
                const chatResponse = await axios.get('/api/chats', {
                    params: { userEmail: session?.user?.email },
                });
                console.log('Chat API Response:', chatResponse.data);

                // Extract messages from response
                const fetchedMessages = chatResponse.data?.data || [];

                if (!Array.isArray(fetchedMessages)) {
                    console.error('Invalid messages format:', fetchedMessages);
                    return;
                }
                function formatGeminiResponseToHTML2(responseText) {
                    // Assuming responseText contains plain text
                    // You can enhance this logic based on your actual Gemini response structure

                    // For example, you can replace certain text patterns with HTML tags
                    const formattedResponse = responseText
                        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')  // Bold for **bold text**
                        .replace(/(__[^_]+__)/g, '<i>$1</i>')    // Italics for __italic text__
                        .replace(/(?:\r\n|\r|\n)/g, '<br>');      // Line breaks for newlines

                    return formattedResponse;
                }

                // Format bot messages to HTML
                const formattedMessages = fetchedMessages.map(message => {
                    if (message.type === 'bot') {
                        return {
                            ...message,
                            message: formatGeminiResponseToHTML2(message.message)
                        };
                    }
                    return message;
                });

                // Update chat history state with formatted messages
                setChatHistory([...formattedMessages]);

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
        setDisabled(true);
        setUserInput("");

        try {
            // Send user input to /api/chats
            const userResponse = await axios.post('/api/chats', {
                userEmail: session?.user?.email,
                type: 'user',
                message: userInput,
            });
            console.log('User message sent:', userResponse.data);

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
            const rawText = result.response.text();
            const botMessage = {
                type: 'bot',
                message: formatGeminiResponseToHTML(result.response.text()),
            };
            setChatHistory((prev) => [...prev, botMessage]);

            // Send bot response to /api/chats
            const botResponse = await axios.post('/api/chats', {
                userEmail: session?.user?.email,
                type: 'bot',
                message: rawText,
            });
            console.log('Bot response sent:', botResponse.data);

            setDisabled(false);
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } catch (error) {
            console.error('Error fetching response:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <>
            <h2 className='text-center text-3xl font-bold mt-2'>Ask AI</h2>
            <p className="text-center text-lg text-gray-600 mt-2">
                Welcome to the AI Financial Assistant. Ask any financial question and get insights based on your data.
            </p>
            <div className="flex flex-col max-w-[1200px] mx-auto p-4 bg-white shadow-lg rounded-lg justify-between mt-3 h-[70vh]">
                <div className="flex flex-col overflow-y-auto mb-4 gap-3" ref={chatContainerRef} id="chatContainer">
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`${chat.type === 'user' ? 'flex justify-start items-start gap-1' : ' flex justify-end items-end gap-1'
                                }`}
                        >
                            {chat.type === 'user' ? (
                                <Image src="/user.svg" width={20} height={20} alt='user' />
                            ) : null}
                            <div dangerouslySetInnerHTML={{ __html: chat.message }} className={`py-1 px-3 w-fit rounded text-lg ${chat.type === 'user' ? 'bg-primary text-white ' : 'text-white bg-secondary'
                                }`} />

                            {chat.type === 'bot' ? (
                                <Image src="/bot.svg" width={20} height={20} alt='user' />

                            ) : null}
                        </div>

                    ))}
                </div>
                <div className="flex">
                    <form onSubmit={handleSubmit} className="flex w-full">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleUserInput}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border border-gray-300 rounded-l"
                            disabled={disabled}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 text-white rounded-r"
                            disabled={disabled}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
