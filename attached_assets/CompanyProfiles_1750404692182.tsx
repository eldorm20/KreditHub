import React, { useEffect, useState } from 'react';

type Company = {
  id: number;
  name: string;
  description?: string;
  logo_path?: string;
};

const CompanyProfiles = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCompanies = async () => {
    const token = localStorage.getItem('token') || '';
    const res = await fetch('http://localhost:5000/companies', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setCompanies(data.companies);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return setMessage('Name is required');

    const token = localStorage.getItem('token') || '';
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logo) formData.append('logo', logo);

    const res = await fetch('http://localhost:5000/companies', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Company profile created!');
      setName('');
      setDescription('');
      setLogo(null);
      fetchCompanies();
    } else {
      setMessage(data.message || 'Failed to create company');
    }
  };

  return (
    <div>
      <h2>Company Profiles</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Company Name" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input type="file" accept="image/*" onChange={e => setLogo(e.target.files ? e.target.files[0] : null)} />
        <button type="submit">Create</button>
      </form>

      <ul>
        {companies.map(c => (
          <li key={c.id}>
            <h3>{c.name}</h3>
            {c.logo_path && (
              <img
                src={`http://localhost:5000/${c.logo_path}`}
                alt={`${c.name} logo`}
                style={{ width: 100, height: 100, objectFit: 'contain' }}
              />
            )}
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyProfiles;
