import { Request, Response } from 'express';
import { pool } from '../utils/db';
import { updateCurrencyRatesNow } from '../jobs/updateCurrencyRates';

// src/controllers/currency.controller.ts
export const getCurrencies = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT code, name, rate_to_uzs AS exchange_rate FROM currencies ORDER BY code ASC');
    res.json({ currencies: result.rows });
  } catch (error) {
    console.error('Currency fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const addCurrency = async (req: Request, res: Response) => {
  const { code, symbol, exchange_rate_to_base } = req.body;
  if (!code || !exchange_rate_to_base) {
    return res.status(400).json({ message: 'Code and exchange rate are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO currencies (code, symbol, exchange_rate_to_base) VALUES ($1, $2, $3) RETURNING *',
      [code.toUpperCase(), symbol, exchange_rate_to_base]
    );
    res.status(201).json({ currency: result.rows[0] });
  } catch (error) {
    console.error('Add currency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const triggerCurrencyUpdate = async (_req: Request, res: Response) => {
  try {
    const result = await updateCurrencyRatesNow();

    if (result.success) {
      res.json({ message: 'Currency rates updated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to update currency rates', error: result.error });
    }
  } catch (error) {
    console.error('Currency update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { symbol, exchange_rate_to_base } = req.body;

  try {
    const result = await pool.query(
      'UPDATE currencies SET symbol = $1, exchange_rate_to_base = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [symbol, exchange_rate_to_base, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Currency not found' });
    }

    res.json({ currency: result.rows[0] });
  } catch (error) {
    console.error('Update currency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Scheduled automatic currency updates every hour
export const scheduleCurrencyUpdate = () => {
  console.log('Starting scheduled currency updates (every hour)');
  setInterval(async () => {
    console.log('Scheduled currency update triggered');
    const result = await updateCurrencyRatesNow();
    if (result.success) {
      console.log('Currency rates updated successfully (scheduled)');
    } else {
      console.error('Scheduled update failed:', result.error);
    }
  }, 3600000); // 3600000ms = 1 hour
};
