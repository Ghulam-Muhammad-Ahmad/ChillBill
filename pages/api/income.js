import connect from '@/lib/mongodb'
import Income from '../../models/Income'

export default async function handler(req, res) {
  await connect()

  const { method, query } = req

  try {
    switch (method) {
      case 'GET': // Fetch all income records within a date range, with recent items first
        if (!query.userEmail || !query.startDate || !query.endDate) {
          return res.status(400).json({ error: 'User email, start date, and end date are required' })
        }
        const incomes = await Income.find({ 
          userEmail: query.userEmail, 
          date: { $gte: new Date(query.startDate), $lte: new Date(query.endDate) } 
        }).sort({ date: -1 }) // Sort by date in descending order to get recent items first
        res.status(200).json(incomes)
        break

      case 'POST': // Add a new income record
        if (!req.body.userEmail || !req.body.amount || !req.body.categoryId || !req.body.date || !req.body.note) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const newIncome = new Income({
          userEmail: req.body.userEmail,
          amount: req.body.amount,
          categoryId: req.body.categoryId,
          date: req.body.date,
          note: req.body.note
        })
        await newIncome.save()
        res.status(201).json(newIncome)
        break

      case 'PUT': // Edit an income record
        if (!req.body.userEmail || !req.body.amount || !req.body.categoryId || !req.body.date || !req.body.note) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const updatedIncome = await Income.findByIdAndUpdate(query.id, req.body, { new: true })
        res.status(200).json(updatedIncome)
        break

      case 'DELETE': // Delete an income record
        if (!query.id) {
          return res.status(400).json({ error: 'Income ID is required' })
        }
        await Income.findByIdAndDelete(query.id)
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
