import { connectDB } from '@/lib/db';
import Message from '@/models/Message';


export default async function handler({req, res}:any) {
await connectDB();
if (req.method === 'GET') {
// return last 100 messages
const msgs = await Message.find({}).sort({ createdAt: -1 }).limit(100);
return res.status(200).json(msgs.reverse());
}


if (req.method === 'POST') {
const { sender, receiver, content } = req.body;
if (!sender || !content) return res.status(400).json({ error: 'Missing fields' });
const m = await Message.create({ sender, receiver, content });
return res.status(201).json(m);
}


return res.status(405).end();
}