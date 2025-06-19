import React, { useState } from 'react';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registrierung erfolgreich! Bitte logge dich ein.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Fehler bei der Registrierung');
      }
    } catch (err) {
      setMessage('Serverfehler');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrieren</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>E-Mail:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Passwort:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Registrieren</button>
    </form>
  );
}

export default RegisterForm;