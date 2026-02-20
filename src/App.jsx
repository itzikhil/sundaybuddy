import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ShopDetailsPage from './pages/ShopDetailsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/place/:id" element={<ShopDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
