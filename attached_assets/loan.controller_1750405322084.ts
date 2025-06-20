import { Request, Response } from 'express';
import { pool } from '../utils/db';

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const createLoanApplication = async (req: AuthRequest, res: Response) => {
  const { amount, purpose } = req.body;
  const userId = req.user?.userId;

  if (!amount || !purpose) {
    return res.status(400).json({ message: 'Amount and purpose are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO loan_applications (user_id, amount, purpose)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, amount, purpose]
    );

    res.status(201).json({ loan: result.rows[0] });
  } catch (err) {
    console.error('Loan creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllLoanApplications = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT la.*, u.name, u.email FROM loan_applications la
       JOIN users u ON la.user_id = u.id
       ORDER BY la.created_at DESC`
    );
    res.json({ loans: result.rows });
  } catch (err) {
    console.error('Loan fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  const loanId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const result = await pool.query(
      `UPDATE loan_applications SET status = $1 WHERE id = $2 RETURNING *`,
      [status, loanId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json({ updated: result.rows[0] });
  } catch (err) {
    console.error('Loan update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
