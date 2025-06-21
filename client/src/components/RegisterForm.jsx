import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FormWrapper = styled.form`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.nav};
  color: ${({ theme }) => theme.text};
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.accent};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 90%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.accent};
  margin: 1rem 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  background-color: ${({ theme }) => theme.accent};
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.body};
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
        navigate('/login')
      } else {
        setMessage(data.message || 'Fehler bei der Registrierung');
      }
    } catch (err) {
      setMessage('Serverfehler');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Heading>Registrieren</Heading>

      {message && <Message>{message}</Message>}

      <InputGroup>
        
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder='Name'
        />
      </InputGroup>

      <InputGroup>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder='Email'
        />
      </InputGroup>

      <InputGroup>
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder='Passwort'
        />
      </InputGroup>

      <Button type="submit">Registrieren</Button>

      <p style={{ textAlign: 'center' }}>
        Du hast bereits ein Konto?{' '}
        <TextButton type="button" onClick={handleLogin}>Login</TextButton>
      </p>
    </FormWrapper>
  );
}

export default RegisterForm;
