import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';

// Themes
const lightTheme = {
  body: '#f5f7fa',
  text: '#1f1f1f',
  nav: '#ffffff',
  accent: '#7c3aed',
};

const darkTheme = {
  body: '#121212',
  text: '#f0f0f0',
  nav: '#1e1e1e',
  accent: '#00c2ff',
};

// GlobalStyle (optional, falls du das nicht schon in Header.jsx einfügst)
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.3s ease, color 0.3s ease;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
