import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl">🧸</div>
            <span className="font-bold text-xl text-gray-900">CuddleBear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              Products
            </Link>

            {/* 🛒 Cart - Visible for both guest and authenticated */}
            <Link to="/cart" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2 relative">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link to="/Checkout" className="text-gray-700 hover:text-primary-600 font-medium">
                Orders
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
                </div>

                {user?.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium hover:bg-purple-200"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Home
            </Link>
            <Link to="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Products
            </Link>
            {/* 🛒 Cart - Visible for both guest and authenticated */}
            <Link to="/cart" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded relative">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute left-8 -top-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Orders
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🧸</div>
              <span className="font-bold text-xl">CuddleBear</span>
            </div>
            <p className="text-gray-400">Your favorite teddy bear shop for quality and comfort.</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 CuddleBear Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
