import connect from '@/lib/mongodb'
import Category from '../../models/Category'

export default async function handler(req, res) {
  await connect()

  const { method, query, body } = req

  try {
    switch (method) {
      case 'GET': // Fetch categories by user email
        if (!query.userEmail) {
          return res.status(400).json({ error: 'User email is required' })
        }
        const categories = await Category.find({ userEmail: query.userEmail })
        res.status(200).json(categories)
        break

      case 'POST': // Add a new category
        if (!body.name || !body.type || !body.userEmail) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const newCategory = new Category({
          name: body.name,
          type: body.type,
          userEmail: body.userEmail,
        })
        await newCategory.save()
        res.status(201).json(newCategory)
        break

      case 'PUT': // Edit an existing category
        if (!query.id || !body.name || !body.type || !body.userEmail) {
          return res.status(400).json({ error: 'All fields are required' })
        }
        const updatedCategory = await Category.findByIdAndUpdate(
          query.id,
          body,
          { new: true }
        )
        res.status(200).json(updatedCategory)
        break

      case 'DELETE': // Delete a category by ID
        if (!query.id) {
          return res.status(400).json({ error: 'Category ID is required' })
        }
        await Category.findByIdAndDelete(query.id)
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
