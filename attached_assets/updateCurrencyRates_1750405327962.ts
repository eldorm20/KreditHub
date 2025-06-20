import axios from 'axios';
import { pool } from '../utils/db';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/UZS';

export const updateCurrencyRatesNow = async () => {
  try {
    const response = await axios.get(API_URL);
    const rates = response.data.rates;

    for (const [code, rate] of Object.entries(rates)) {
      await pool.query(
        `UPDATE currencies SET exchange_rate_to_base = $1, updated_at = CURRENT_TIMESTAMP WHERE code = $2`,
        [rate, code]
      );
    }
    console.log('Currency rates updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to update currency rates:', error);
    return { success: false, error: error.message };
  }
};
