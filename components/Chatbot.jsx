import React, { useState, useEffect, useRef, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import dotenv from "dotenv";
import { MonthContext } from "@/context/monthContext";

dotenv.config();

const ChatBot = () => {
  const { monthNumber } = useContext(MonthContext);
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
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log("API Key:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    const genAIInstance = new GoogleGenerativeAI(
      "AIzaSyAmD_PHEGt2ckZfg-iGZR9wDes4eyxKU0o"
    );
    const genModel = genAIInstance.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
    setGenAI(genAIInstance);
    setModel(genModel);

    const fetchData = async () => {
      try {
        if (!session?.user?.email) {
          // console.error("User email is required");
          return;
        }

        // Calculate date range for the current month
        const currentDate = new Date();
        const startDate = new Date(
          currentDate.getFullYear(),
          monthNumber - 1,
          1
        );
        const endDate = new Date(currentDate.getFullYear(), monthNumber, 0);

        // Fetch categories
        const categoryResponse = await axios.get("/api/category", {
          params: { userEmail: session?.user?.email },
        });
        setCategoryData(categoryResponse.data);

        // Fetch expenses for the current month
        const expenseResponse = await axios.get("/api/expense", {
          params: {
            userEmail: session?.user?.email,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        });
        const fetchedExpenseData = expenseResponse.data;
        setExpenseData(fetchedExpenseData);

        // Fetch income for the current month
        const incomeResponse = await axios.get("/api/income", {
          params: {
            userEmail: session?.user?.email,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        });
        const fetchedIncomeData = incomeResponse.data;
        setIncomeData(fetchedIncomeData);

        // Calculate budget
        const totalIncome = fetchedIncomeData.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        const totalExpenses = fetchedExpenseData.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        setTotalIncome(totalIncome);
        setTotalExpenses(totalExpenses);
        setBudget(totalIncome - totalExpenses);
        // Fetch chat messages
        const chatResponse = await axios.get("/api/chats", {
          params: { userEmail: session?.user?.email },
        });
        // console.log('Chat API Response:', chatResponse.data);

        // Extract messages from response
        const fetchedMessages = chatResponse.data?.data || [];

        if (!Array.isArray(fetchedMessages)) {
          console.error("Invalid messages format:", fetchedMessages);
          return;
        }
        function formatGeminiResponseToHTML2(responseText) {
          // Assuming responseText contains plain text
          // You can enhance this logic based on your actual Gemini response structure

          // For example, you can replace certain text patterns with HTML tags
          const formattedResponse = responseText
            .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>") // Bold for **bold text**
            .replace(/(__[^_]+__)/g, "<i>$1</i>") // Italics for __italic text__
            .replace(/(?:\r\n|\r|\n)/g, "<br>"); // Line breaks for newlines

          return formattedResponse;
        }

        // Format bot messages to HTML
        const formattedMessages = fetchedMessages.map((message) => {
          if (message.type === "bot") {
            return {
              ...message,
              message: formatGeminiResponseToHTML2(message.message),
            };
          }
          return message;
        });

        // Update chat history state with formatted messages
        setChatHistory([...formattedMessages]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [session?.user?.email, monthNumber]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const userMessage = { type: "user", message: userInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setDisabled(true);
    setUserInput("");

    try {
      // Send user input to /api/chats
      const userResponse = await axios.post("/api/chats", {
        userEmail: session?.user?.email,
        type: "user",
        message: userInput,
      });
      console.log("User message sent:", userResponse.data);

      // Create a compiled instruction from your data
      const compiledData = `Here’s an overview of their income, expenses, and budget:

            📌 **Income Overview:**
            ${
              Array.isArray(incomeData) &&
              incomeData
                .map(
                  (income) =>
                    `- **${
                      categoryData.find((c) => c._id === income.categoryId)
                        ?.name
                    }**: ${session?.user?.currency} ${
                      income.amount
                    } (Source: "${income.note || "N/A"}")`
                )
                .join("\n")
            }
            
            💰 **Expense Breakdown:**
            ${
              Array.isArray(expenseData) &&
              expenseData
                .map(
                  (expense) =>
                    `- **${
                      categoryData.find((c) => c._id === expense.categoryId)
                        ?.name
                    }**:  ${session?.user?.currency} ${expense.amount} (For: "${
                      expense.description || "N/A"
                    }")`
                )
                .join("\n")
            }
            
            📊 **Budget Summary:**
            - **Total Income:**  ${session?.user?.currency} ${totalIncome}
            - **Total Expenses:**  ${session?.user?.currency} ${totalExpenses}
            - **Remaining Budget:** ** ${session?.user?.currency} ${budget}**  
            
            💡 **Insights & Suggestions:**  
            - Your expenses account for **${(
              (totalExpenses / totalIncome) *
              100
            ).toFixed(2)}%** of your total income. ${
        totalExpenses > totalIncome
          ? "You're overspending! Consider adjusting your budget."
          : "You're managing your finances well!"
      }
            - Consider setting aside a portion of your remaining budget for savings or investments.  
            - Review categories where you can cut unnecessary spending to improve financial stability.  

            ** Personal Info **
            - User Name is ${session?.user?.name}
            - User Email is ${session?.user?.email}
            - User Currency Symbol is ${session?.user?.currency}
            
            `;
      console.log(compiledData);

      const chatProp = chatHistory.map((msg) => ({
        role: msg.type === "user" ? "user" : "model", // Convert 'bot' to 'model'
        parts: [{ text: msg.message }], // Keep only the message content
      }));

      chatProp.push({
        role: "user",
        parts: [
          {
            text: `User Query: "${userInput}"
            
            📊 **Financial Data:**
            "${compiledData}"

            🔹 **Guidelines for Response:**  
            - You are a **financial assistant** providing insights based strictly on the user's financial data.  
            - **Do not answer non-financial queries.**
            - **Ensure all monetary values are formatted with commas** (e.g., Rs 10,000 instead of Rs 10000).  
            - Provide **only accurate and relevant information** based on the given data—do not assume or add extra details.  
            - If the user asks for suggestions, offer **practical financial advice** on budgeting, savings, or expense management.  
            - Keep responses **concise, clear, and structured** for easy readability.  

            💡 Now, generate a response based on the above instructions.`,
          },
        ],
      });

      const result = await model.generateContent({
        contents: chatProp,
      });

      function formatGeminiResponseToHTML(responseText) {
        // Assuming responseText contains plain text
        // You can enhance this logic based on your actual Gemini response structure

        // For example, you can replace certain text patterns with HTML tags
        const formattedResponse = responseText
          .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>") // Bold for **bold text**
          .replace(/(__[^_]+__)/g, "<i>$1</i>") // Italics for __italic text__
          .replace(/(?:\r\n|\r|\n)/g, "<br>"); // Line breaks for newlines

        return formattedResponse;
      }
      const rawText = result.response.text();
      const botMessage = {
        type: "bot",
        message: formatGeminiResponseToHTML(result.response.text()),
      };
      setChatHistory((prev) => [...prev, botMessage]);

      // Send bot response to /api/chats
      const botResponse = await axios.post("/api/chats", {
        userEmail: session?.user?.email,
        type: "bot",
        message: rawText,
      });
      console.log("Bot response sent:", botResponse.data);

      setDisabled(false);
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };
  const handleDeleteChat = async () => {
    try {
      const response = await axios.delete("/api/chats", {
        params: { userEmail: session?.user?.email },
      });
      if (response.data.success) {
        setChatHistory([]);
        console.log("Chat history cleared");
      } else {
        console.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <>
      <h2 className="text-center text-3xl font-bold mt-2 pt-3">Ask AI</h2>
      <p className="text-center text-lg text-gray-600 mt-2">
        Welcome to the AI Financial Assistant. Ask any financial question and
        get insights based on your data.
      </p>
      <div className="flex flex-col max-w-[1200px] mx-auto bg-white shadow-lg justify-between mt-3 h-[70vh] border-top-right-radius-10px overflow-hidden border-top-left-radius-10px">
        <div className="flex px-4 py-3  bg-primary text-white justify-between">
          <h3>AI Chatbot</h3>
          <button
            onClick={handleDeleteChat}
            className="flex justify-center items-center gap-2"
          >
            <svg
              width="18"
              height="23"
              viewBox="0 0 300 390"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M128.56 135.92L121.168 9.01617C121.108 7.93052 121.27 6.84406 121.644 5.82317C122.018 4.80228 122.597 3.86837 123.344 3.0785C124.091 2.28862 124.992 1.65934 125.99 1.2291C126.989 0.798867 128.064 0.576701 129.152 0.576172H170.848C171.935 0.576701 173.011 0.798867 174.009 1.2291C175.008 1.65934 175.908 2.28862 176.656 3.0785C177.403 3.86837 177.981 4.80228 178.355 5.82317C178.729 6.84406 178.892 7.93052 178.832 9.01617L171.448 135.92H128.56ZM247.648 159.92H52.3518C38.519 159.937 25.2577 165.44 15.4765 175.221C5.69525 185.002 0.192718 198.263 0.175781 212.096V228.152H299.824V212.096C299.807 198.263 294.304 185.002 284.523 175.221C274.742 165.44 261.481 159.937 247.648 159.92ZM0.175781 389.424H52.3998V337.904C52.3998 334.722 53.6641 331.669 55.9145 329.419C58.1649 327.168 61.2172 325.904 64.3998 325.904C67.5824 325.904 70.6346 327.168 72.8851 329.419C75.1355 331.669 76.3998 334.722 76.3998 337.904V389.424H175.016V299.24C175.016 296.058 176.28 293.005 178.531 290.755C180.781 288.504 183.833 287.24 187.016 287.24C190.198 287.24 193.251 288.504 195.501 290.755C197.752 293.005 199.016 296.058 199.016 299.24V389.416H228.032V345.64C228.032 342.458 229.296 339.405 231.547 337.155C233.797 334.904 236.849 333.64 240.032 333.64C243.214 333.64 246.267 334.904 248.517 337.155C250.767 339.405 252.032 342.458 252.032 345.64V389.424H299.832V252.152H0.175781V389.424Z"
                fill="#fff"
              />
            </svg>
            Clear Chat
          </button>
        </div>
        <div
          className="flex flex-col overflow-y-auto mb-4 p-4 gap-3"
          ref={chatContainerRef}
          id="chatContainer"
        >
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`${
                chat.type === "user"
                  ? "flex justify-start items-start gap-1"
                  : " flex justify-end items-end gap-1"
              }`}
            >
              {chat.type === "user" ? (
                <Image src="/user.svg" width={20} height={20} alt="user" />
              ) : null}
              <div
                dangerouslySetInnerHTML={{ __html: chat.message }}
                className={`py-1 px-3 w-fit rounded text-lg ${
                  chat.type === "user"
                    ? "bg-primary text-white "
                    : "text-white bg-secondary"
                }`}
              />

              {chat.type === "bot" ? (
                <Image src="/bot.svg" width={20} height={20} alt="user" />
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
