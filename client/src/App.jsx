


import './App.css'
import { Outlet } from 'react-router'
import Header from './components/Header.jsx'



function App() {

  return (
    <>

     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main>
          <Outlet />
        </main>
        
      </div>
    
    </>
  )
}

export default App
