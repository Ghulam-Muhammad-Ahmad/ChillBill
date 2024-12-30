import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import connect from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connect();
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
