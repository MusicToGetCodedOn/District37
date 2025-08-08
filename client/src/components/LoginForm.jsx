import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



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

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 90%;
  margin-bottom: 1rem;
`;

const PasswordInput = styled(Input)`
  padding-right: 2.5rem;
  width: 94%;
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
  margin-right: -10%;
  margin-top: -2%;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  min-height: 100vh;
`;

const StyledForm = styled.form`
  background-color: ${({ theme }) => theme.nav};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  transition: all 0.3s ease;
`;

const Heading = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.accent};
  text-align: center;
`;


const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.body};
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  background-color:#E57373
  border-radius: 8px
`;

const RegisterText = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
`;

const RegisterButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);


  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login fehlgeschlagen');
      }


      const token = data.token;
      const role = data.user?.role || '';
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      login(data.token, role);

      login(token, role);


      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <Heading>Login</Heading>

        {error && <ErrorText>{error}</ErrorText>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInputWrapper>
          <PasswordInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="pwd"
          />
          <TogglePasswordButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Passwort anzeigen/verstecken"
            className='togglepwd'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </TogglePasswordButton>
        </PasswordInputWrapper>


        <SubmitButton type="submit">Einloggen</SubmitButton>

        <RegisterText>
          Noch kein Konto?{' '}
          <RegisterButton type="button" onClick={handleRegister}>
            Registrieren
          </RegisterButton>
        </RegisterText>
      </StyledForm>
    </FormContainer>
  );
};

export default LoginForm;
