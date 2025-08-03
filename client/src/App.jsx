import { Box } from '@mui/material';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';

// Layout for all protected pages, includes Header, Footer, and Sidebar
const ProtectedLayout = () => (
  <Box sx={ { display: 'flex', flexDirection: 'column', minHeight: '100vh' } }>
    <Header />
    <Box sx={ { display: 'flex', flex: 1 } }>
      <Sidebar />
      {/* The Outlet component renders the matched child route's element */ }
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

function App() {
  return (
    <Routes>
      {/* Public routes that render without the main layout */ }
      <Route path="/" element={ <HomePage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/register" element={ <RegisterPage /> } />

      {/* Protected routes are nested inside the ProtectedRoute component */ }
      <Route element={ <ProtectedRoute /> }>
        <Route element={ <ProtectedLayout /> }>
          <Route path="/dashboard" element={ <DashboardPage /> } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
