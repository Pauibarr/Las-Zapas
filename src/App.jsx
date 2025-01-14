import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './views/Home'
import { Footer } from './components/Footer'
import { Hombre } from './views/Hombre'
import { Mujer } from './views/Mujer'
import { Login } from './components/Login'
import { Registro } from './components/Registro'
import { Usuarios } from './components/Usuarios'

export default function App() {

  return (
    <>
    <div className="dark:bg-blue-gray-900 min-h-screen">
    <Header/>
    {/* Enrutamiento */}
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hombre' element={<Hombre />} />
        <Route path='/mujer' element={<Mujer />} />
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path='/footer' element={<Footer />} />
      </Routes>
    <Footer/>
      </div>
    </>
  )
}