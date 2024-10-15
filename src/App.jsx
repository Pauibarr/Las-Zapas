import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './views/Home'
import { Footer } from './components/Footer'
import { Hombre } from './views/Hombre'
import { Mujer } from './views/Mujer'
import { SignUp } from './components/SignUp'
import { Login } from './components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="dark:bg-blue-gray-900 min-h-screen">
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hombre' element={<Hombre />} />
        <Route path='/mujer' element={<Mujer />} />
        <Route path='/footer' element={<Footer />} />
      </Routes>
    <Footer/>
      </div>
    </>
  )
}

export default App
