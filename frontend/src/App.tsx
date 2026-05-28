import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout/PublicLayout";
import { PrivateLayout } from "./layouts/PrivateLayout/PrivateLayout";
import { PrivateLayout as AdminLayout } from "./layouts/PrivateLayout";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Events } from "./pages/Events/Events";
import { CreateEvent } from "./pages/Events/CreateEvent";
import { EventDetail } from "./pages/Events/EventDetail";
import { MyTickets } from "./pages/Tickets/MyTickets";
import { TicketView } from "./pages/Tickets/TicketView";
import { EventsGrid } from "./pages/Admin/EventsGrid";
import { Footer } from "./components/Footer/Footer";

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
          <Route path="/meus-ingressos" element={<MyTickets />} />
          <Route path="/ingresso/:id" element={<TicketView />} />
        </Route>

        {/* Painel Admin (#158) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="eventos" element={<EventsGrid />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
