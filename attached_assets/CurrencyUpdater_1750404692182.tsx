// src/components/admin/CurrencyUpdater.tsx
import React, { useState } from 'react';

// Helper to get token (you can move this to a utils/auth.ts file for reuse)
const getToken = () => localStorage.getItem('token') || '';

const CurrencyUpdater = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async () => {
    const token = getToken();

    if (!token) {
      setMessage('You must be logged in to update currency rates.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5000/currencies/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setMessage('Unauthorized: Please login again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMessage('Currency rates updated successfully!');
      } else {
        setMessage(`Error: ${data.message || 'Failed to update'}`);
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Currency Rates'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CurrencyUpdater;
