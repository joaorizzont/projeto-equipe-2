import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Events } from './pages/Events/Events'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            {/* Adicionando rotas de placeholder para o fluxo funcionar */}
            <Route path="/signin" element={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Página de Login (Placeholder)</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
