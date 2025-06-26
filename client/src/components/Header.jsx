import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import styled, { useTheme, ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../assets/GlobalStyle';



const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.nav};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
  border-radius: 30px;
  width: 1200px;
`;

const Logo = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.accent};
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 2px;
    background: ${({ theme }) => theme.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.3rem;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const StyledButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0%;
    height: 2px;
    background: ${({ theme }) => theme.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

export default function Header({ darkMode, setDarkMode }) {
  const theme = useTheme();
  
  const navigate = useNavigate();

  const { isLoggedIn, role, logout, isAuthReady } = useContext(AuthContext);

if (!isAuthReady) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <GlobalStyle />
      <HeaderContainer>
        <Logo>District37</Logo>
        <Nav>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/appointment">Appointment</StyledLink>
          <StyledLink to="/about">About</StyledLink>

          {isLoggedIn ? (
            <StyledButton onClick={handleLogout}>Logout</StyledButton>
          ) : (
            <StyledButton onClick={handleLogin}>Login</StyledButton>
          )}

         {isLoggedIn && ['admin', 'superuser'].includes(role?.toLowerCase()) && (
  <StyledLink to="/dashboard">Dashboard</StyledLink>
)}

          <ToggleButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </ToggleButton>
        </Nav>
      </HeaderContainer>
    </>
  );
}