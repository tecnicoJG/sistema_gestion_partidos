import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminPage } from './pages/admin/AdminPage';
import { GamePage } from './pages/game/GamePage';
import { SetupWizard } from './pages/setup-wizard/SetupWizard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup-wizard" element={<SetupWizard />} />
        <Route element={<Layout />}>
          <Route path="/" element={<GamePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
