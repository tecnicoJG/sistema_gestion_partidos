import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './pages/admin/AdminPage';
import { GamePage } from './pages/game/GamePage';
import { Layout } from './components/layout/Layout';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GamePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
