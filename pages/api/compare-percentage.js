// pages/api/analytics.js

import connect from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Income from '@/models/Income';

export default async function handler(req, res) {
  try {
    // Establish database connection
    await connect();

    const { method, query } = req;

    // Only allow GET requests
    if (method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const userEmail = query.userEmail;
    const monthNumber = parseInt(query.monthNumber, 10);

    console.log('Received request:', { userEmail, monthNumber });

    // Validate userEmail
    if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Validate monthNumber
    if (isNaN(monthNumber) || monthNumber < -1 || monthNumber === 0 || monthNumber > 12) {
      return res.status(400).json({ error: 'Invalid month number' });
    }

    // Special case for monthNumber === -1
    if (monthNumber === -1) {
      return res.status(200).json({
        userEmail,
        expensesPercentageChange: 0,
        incomesPercentageChange: 0,
      });
    }

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = monthNumber - 1; // JavaScript months are 0-based

    const currentMonthStart = new Date(currentYear, currentMonthIndex, 1);
    const currentMonthEnd = new Date(currentYear, currentMonthIndex + 1, 1);

    // Handle year wrap-around for previous month
    const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const previousMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

    const previousMonthStart = new Date(previousMonthYear, previousMonthIndex, 1);
    const previousMonthEnd = new Date(previousMonthYear, previousMonthIndex + 1, 1);

    // Fetch expenses and incomes for current and previous months
    const [currentMonthExpenses, currentMonthIncomes, previousMonthExpenses, previousMonthIncomes] = await Promise.all([
      Expense.find({
        userEmail,
        date: { $gte: currentMonthStart, $lt: currentMonthEnd },
      }),
      Income.find({
        userEmail,
        date: { $gte: currentMonthStart, $lt: currentMonthEnd },
      }),
      Expense.find({
        userEmail,
        date: { $gte: previousMonthStart, $lt: previousMonthEnd },
      }),
      Income.find({
        userEmail,
        date: { $gte: previousMonthStart, $lt: previousMonthEnd },
      }),
    ]);

    // Calculate totals
    const currentMonthExpensesTotal = currentMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const currentMonthIncomesTotal = currentMonthIncomes.reduce((acc, income) => acc + income.amount, 0);
    const previousMonthExpensesTotal = previousMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const previousMonthIncomesTotal = previousMonthIncomes.reduce((acc, income) => acc + income.amount, 0);

    // Calculate percentage changes
    const expensesPercentageChange =
      previousMonthExpensesTotal !== 0
        ? ((currentMonthExpensesTotal - previousMonthExpensesTotal) / previousMonthExpensesTotal) * 100
        : currentMonthExpensesTotal !== 0
        ? 100
        : 0;

    const incomesPercentageChange =
      previousMonthIncomesTotal !== 0
        ? ((currentMonthIncomesTotal - previousMonthIncomesTotal) / previousMonthIncomesTotal) * 100
        : currentMonthIncomesTotal !== 0
        ? 100
        : 0;

    // Send response
    return res.status(200).json({
      userEmail,
      expensesPercentageChange,
      incomesPercentageChange,
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
