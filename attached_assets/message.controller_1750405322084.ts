import { Request, Response } from 'express';
import { pool } from '../utils/db';

export const sendMessage = async (req: Request, res: Response) => {
  const senderId = req.user?.userId;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: 'receiverId and content are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, content]
    );
    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessagesWithUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const otherUserId = parseInt(req.params.userId, 10);

  if (!otherUserId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
