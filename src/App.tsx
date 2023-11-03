import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import Room from './pages/Room'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<HomePage />} /> 
          <Route path="/room/:id" element={<Room />} /> 
          <Route path="*" element={<NotFound />} />
        </Route> 
      </Routes>
    </>
  )
}

export default App
