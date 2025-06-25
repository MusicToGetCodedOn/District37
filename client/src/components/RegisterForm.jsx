import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormWrapper = styled.form`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.nav};
  color: ${({ theme }) => theme.text};
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
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
  position: relative;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.8rem 1rem;
  padding-right: 2.5rem;
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

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwörter stimmen nicht überein');
      return;
    }

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
        setConfirmPassword('');
        navigate('/login');
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
          placeholder="Name"
        />
      </InputGroup>

      <InputGroup>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
      </InputGroup>

      <InputGroup>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Passwort"
        />
        <TogglePasswordButton
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          aria-label="Passwort anzeigen/verstecken"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </TogglePasswordButton>
      </InputGroup>

      <InputGroup>
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          placeholder="Passwort bestätigen"
        />
        <TogglePasswordButton
          type="button"
          onClick={() => setShowConfirmPassword(prev => !prev)}
          aria-label="Passwort bestätigen anzeigen/verstecken"
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </TogglePasswordButton>
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
