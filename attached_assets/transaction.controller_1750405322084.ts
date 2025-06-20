import { Request, Response } from 'express';
import { pool } from '../utils/db';

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

const allowedTypes = ['payment', 'loan-disbursement', 'repayment'];

export const createTransaction = async (req: AuthRequest, res: Response) => {
  const { amount, type, currency, description } = req.body;
  const userId = req.user?.userId;

  if (!amount || !type || !currency) {
    return res.status(400).json({ message: 'Amount, type, and currency are required' });
  }

  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ message: `Invalid transaction type. Allowed types: ${allowedTypes.join(', ')}` });
  }

  try {
    // Validate currency exists in currencies table
    const currencyCheck = await pool.query(
      'SELECT * FROM currencies WHERE code = $1',
      [currency.toUpperCase()]
    );

    if (currencyCheck.rows.length === 0) {
      return res.status(400).json({ message: `Unsupported currency code: ${currency}` });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, currency, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, amount, type, currency.toUpperCase(), description]
    );

    res.status(201).json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const { type, startDate, endDate } = req.query;

  let filters = [];
  let values: any[] = [];
  let counter = 1;

  if (type) {
    filters.push(`t.type = $${counter++}`);
    values.push(type);
  }
  if (startDate) {
    filters.push(`t.created_at >= $${counter++}`);
    values.push(startDate);
  }
  if (endDate) {
    filters.push(`t.created_at <= $${counter++}`);
    values.push(endDate);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const result = await pool.query(
      `SELECT t.*, u.name, u.email
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${counter++} OFFSET $${counter++}`,
      [...values, limit, offset]
    );

    res.json({
      page,
      limit,
      transactions: result.rows,
    });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('User transaction fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
