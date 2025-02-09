import connect from '@/lib/mongodb';
import Chat from '@/models/Chats'


export default async (req, res) => {
    connect();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        if (!req.query.userEmail) {
          res.status(400).json({ success: false, message: 'Email is required' });
          return;
        }
        const chats = await Chat.find({ userEmail: req.query.userEmail }).sort({ date: 1 }); // Changed sort order to 1 for sequence by date
        res.status(200).json({ success: true, data: chats });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        if (!req.body.userEmail || !req.body.message || !req.body.type) {
          res.status(400).json({ success: false, message: 'Email, message and type are required' });
          return;
        }
        console.log(req.body)
        const newChat = new Chat({
            type: req.body.type,
            message: req.body.message,
          userEmail: req.body.userEmail
        });
        const chat = await newChat.save();
        res.status(201).json({ success: true, data: chat });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'DELETE':
      try {
        if (!req.query.userEmail) {
          res.status(400).json({ success: false, message: 'Email is required' });
          return;
        }
        const deletedChats = await Chat.deleteMany({ userEmail: req.query.userEmail });
        if (!deletedChats) {
          res.status(404).json({ success: false, message: 'Chat not found' });
          return;
        }
        res.status(200).json({ success: true, data: deletedChats });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}



