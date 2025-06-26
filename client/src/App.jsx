import './App.css';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from 'styled-components';
import { useEffect, useState } from 'react';
import { GlobalStyle } from './assets/GlobalStyle.js';
import { lightTheme, darkTheme } from './assets/theme.js';
import Header from './Components/Header.jsx';




function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
      <AuthProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyle />
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <main style={{ flex: 1 }}>
              <Outlet />
            </main>  
        </ThemeProvider>     
      </AuthProvider>
    
  );
}

export default App;
