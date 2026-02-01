import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/Home';
import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { ProductsPage } from '../pages/Products';
import { ProductDetailPage } from '../pages/ProductDetail';
import { CartPage } from '../pages/Cart';
import { ProtectedRoute, AdminRoute, PublicRoute } from '../middleware/ProtectedRoute';
import Checkout from "../pages/Checkout";
import OrderHistory from "../pages/OrderHistory";
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />

      {/* Protected Routes (coming soon) */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order" element={<OrderHistory />} />
      {/* <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      /> */}

      {/* Admin Routes (coming soon) */}
      {/* <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      /> */}
    </Routes>
  );
}
