import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout/PublicLayout";
import { PrivateLayout } from "./layouts/PrivateLayout/PrivateLayout";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Events } from "./pages/Events/Events";
import { CreateEvent } from "./pages/Events/CreateEvent";
import { EventDetail } from "./pages/Events/EventDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rotas Privadas (Logadas) */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/eventos/novo" element={<CreateEvent />} />
          <Route path="/eventos/:id" element={<EventDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

