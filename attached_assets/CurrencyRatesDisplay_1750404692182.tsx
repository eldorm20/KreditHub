import React, { useEffect, useState } from 'react';

interface Currency {
  code: string;
  name: string;
  exchange_rate: number;
}

const CurrencyRatesDisplay = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch('/currencies');
        if (!res.ok) throw new Error('Failed to fetch currency data');
        const data = await res.json();
        setCurrencies(data.currencies);
      } catch (e: any) {
        setError(e.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchCurrencies();
  }, []);

  if (loading) return <p>Loading currency rates...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Current Currency Rates</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Rate to UZS</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map(({ code, name, exchange_rate }) => (
            <tr key={code}>
              <td className="border border-gray-300 px-4 py-2">{code}</td>
              <td className="border border-gray-300 px-4 py-2">{name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{exchange_rate.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrencyRatesDisplay;
