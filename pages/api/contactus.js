import connect from '@/lib/mongodb'
import  Contact  from "@/models/Contact";

export default async function handler(req, res) {
  await connect();

  if (req.method === 'POST') {
    try {
      const contactData = req.body;
      const newContact = await Contact.create(contactData);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
