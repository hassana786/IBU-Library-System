import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Magacyada waxaan u waafajiyay sidii faylashaadu ugu magacaaban yihiin "dir"
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/Dashboard';
import BooksPage from './pages/Books';
import MyBorrowingsPage from './pages/MyBorrowingsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import MyFinesPage from './pages/MyFinesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-borrowings"
            element={
              <ProtectedRoute requiredRole="student">
                <MyBorrowingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute requiredRole="student">
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-fines"
            element={
              <ProtectedRoute requiredRole="student">
                <MyFinesPage />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;