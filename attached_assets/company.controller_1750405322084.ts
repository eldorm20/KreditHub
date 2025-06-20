import { Request, Response } from 'express';
import { pool } from '../utils/db';
import fs from 'fs';
import path from 'path';

export const createCompanyProfile = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const logo = req.file;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const logoPath = logo ? logo.path : null;

  try {
    const result = await pool.query(
      `INSERT INTO company_profiles (name, description, logo_path)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, logoPath]
    );
    res.status(201).json({ company: result.rows[0] });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCompanyProfiles = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM company_profiles ORDER BY created_at DESC');
    res.json({ companies: result.rows });
  } catch (error) {
    console.error('Fetch companies error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const logo = req.file;

  try {
    // Fetch existing company to delete old logo if replaced
    const existing = await pool.query('SELECT * FROM company_profiles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    let logoPath = existing.rows[0].logo_path;
    if (logo) {
      // Delete old logo file if exists
      if (logoPath && fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
      logoPath = logo.path;
    }

    const result = await pool.query(
      `UPDATE company_profiles SET name = $1, description = $2, logo_path = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [name || existing.rows[0].name, description || existing.rows[0].description, logoPath, id]
    );

    res.json({ company: result.rows[0] });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCompanyProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM company_profiles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const logoPath = existing.rows[0].logo_path;
    if (logoPath && fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await pool.query('DELETE FROM company_profiles WHERE id = $1', [id]);
    res.json({ message: 'Company deleted' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
