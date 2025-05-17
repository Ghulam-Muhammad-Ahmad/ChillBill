import connect from '@/lib/mongodb'
import Expense from '../../models/Expense'

export default async function handler(req, res) {
  await connect()

  const { method, query } = req

  try {
    switch (method) {
      case 'GET':
        console.log("All Data: " + query.allData);
      
        if (!query.userEmail) {
          return res.status(400).json({ error: 'User email is required' });
        }
      
        const allData = query.allData === 'true';
        let filter = { userEmail: query.userEmail };
      
        if (!allData) {
          if (!query.startDate || !query.endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
          }
      
          const startDate = new Date(query.startDate);
          const endDate = new Date(query.endDate);
          if (startDate >= endDate) {
            return res.status(400).json({ error: 'Invalid date range' });
          }
      
          endDate.setHours(23, 59, 59, 999);
          filter.date = { $gte: startDate, $lte: endDate };
        }
      
        console.log(filter);
        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.status(200).json(expenses);
        break;
      
      

      case 'POST': // Add a new expense record
        if (!req.body.userEmail || !req.body.amount || !req.body.categoryId || !req.body.date || !req.body.description) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const newExpense = new Expense({
          userEmail: req.body.userEmail,
          amount: req.body.amount,
          categoryId: req.body.categoryId,
          date: req.body.date,
          description: req.body.description,
        })
        await newExpense.save()
        res.status(201).json(newExpense)
        break

      case 'PUT': // Edit an expense record
        if (!req.body.userEmail || !req.body.amount || !req.body.categoryId || !req.body.date || !req.body.description) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const updatedExpense = await Expense.findByIdAndUpdate(query.id, req.body, { new: true })
        res.status(200).json(updatedExpense)
        break

      case 'DELETE': // Delete an expense record
        if (!query.id) {
          return res.status(400).json({ error: 'Expense ID is required' })
        }
        await Expense.findByIdAndDelete(query.id)
        res.status(204).end()
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
