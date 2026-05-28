import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { PrivateLayout } from './layouts/PrivateLayout';
import { EventsGrid } from './pages/Admin/EventsGrid';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<PrivateLayout />}>
        <Route path="eventos" element={<EventsGrid />} />
      </Route>
    </Routes>
  );
};
