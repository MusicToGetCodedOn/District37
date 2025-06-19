


import './App.css'
import { Outlet } from 'react-router'
import Header from './components/Header.jsx'
import { AuthProvider } from './context/AuthContext.jsx'



function App() {

  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main>
          <Outlet />
        </main>
        
      </div>
    </AuthProvider>
  )
}

    
  

export default App
