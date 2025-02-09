import { createContext, useState } from 'react';

// Create the context
export const MonthContext = createContext();

// Create a provider component
export const MonthProvider = ({ children }) => {
  const [monthNumber, setMonthNumber] = useState(new Date().getMonth() + 1); // Current month number

  // Method to update the month number
  const updateMonthNumber = (newMonthNumber) => {
    setMonthNumber(newMonthNumber);
  };

  // Method to get the month number
  const getMonthNumber = () => {
    return monthNumber;
  };

  return (
    <MonthContext.Provider value={{ monthNumber, updateMonthNumber, getMonthNumber }}>
      {children}
    </MonthContext.Provider>
  );
};