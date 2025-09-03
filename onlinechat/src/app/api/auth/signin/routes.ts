import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export default async function handler({req, res}:any) {
if (req.method !== 'POST') return res.status(405).end();
await connectDB();


const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
return res.status(200).json({ token, user: { id: user._id, username: user.username } });
}