import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavigation = () => {
    if (!user) return null;

    const baseLinks = (
      <>
        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
          Dashboard
        </Link>
        <Link to="/books" className="text-gray-600 hover:text-blue-600 font-medium">
          Books
        </Link>
      </>
    );

    const studentLinks = (
      <>
        {baseLinks}
        <Link to="/my-borrowings" className="text-gray-600 hover:text-blue-600 font-medium">
          My Borrowings
        </Link>
        <Link to="/my-reservations" className="text-gray-600 hover:text-blue-600 font-medium">
          Reservations
        </Link>
        <Link to="/my-fines" className="text-gray-600 hover:text-blue-600 font-medium">
          Fines
        </Link>
      </>
    );

    const librarianLinks = (
      <>
        {baseLinks}
        <Link to="/borrowings" className="text-gray-600 hover:text-blue-600 font-medium">
          Borrowings
        </Link>
        <Link to="/reservations" className="text-gray-600 hover:text-blue-600 font-medium">
          Reservations
        </Link>
        <Link to="/reports" className="text-gray-600 hover:text-blue-600 font-medium">
          Reports
        </Link>
      </>
    );

    const adminLinks = (
      <>
        {baseLinks}
        <Link to="/users" className="text-gray-600 hover:text-blue-600 font-medium">
          Users
        </Link>
        <Link to="/authors" className="text-gray-600 hover:text-blue-600 font-medium">
          Authors
        </Link>
        <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium">
          Categories
        </Link>
        <Link to="/reports" className="text-gray-600 hover:text-blue-600 font-medium">
          Reports
        </Link>
        <Link to="/audit-logs" className="text-gray-600 hover:text-blue-600 font-medium">
          Audit Logs
        </Link>
      </>
    );

    if (user.role === 'student') return studentLinks;
    if (user.role === 'librarian') return librarianLinks;
    if (user.role === 'admin') return adminLinks;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              📚 Smart Library
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex gap-8">
              {renderNavigation()}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <span className="text-sm text-gray-600">
                    {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {renderNavigation()}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 Smart Library Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;