import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      setToken(res.data.access_token);
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /><br/>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" /><br/>
        <button type="submit">Login</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
