import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import connect from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connect();
    const { email, newPassword } = req.body;
console.log(req.body)
    // Validate the inputs
    if (!email || !newPassword ) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'No user found with that email address' });
      }

      // Hash the new password before saving
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
