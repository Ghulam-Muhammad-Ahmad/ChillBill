import { getSession } from 'next-auth/react';
import connect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, currency } = req.body;

    if (!email || !username || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Connect to MongoDB
      await connect();

      // Find the user by email and update the information
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { username, currency },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Optionally, re-authenticate the user or refresh their session here
      res.status(200).json({ message: 'User settings updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
