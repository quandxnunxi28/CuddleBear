# Hướng dẫn mở rộng CuddleBear Frontend

## 1. Thêm trang sản phẩm

### Tạo file `src/pages/Products.jsx`

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api/authApi';
import { Card, Loading, Alert, Button, Input } from '../components/ui';
import { Star, Filter } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll({ 
          search, 
          category,
          page: 1,
          limit: 20 
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Add filter options */}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-primary-600 font-bold">${product.price}</p>
            <Link to={`/products/${product.id}`} className="btn-primary">
              View Details
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Thêm route
Cập nhật `src/routes/AppRoutes.jsx`:

```jsx
<Route path="/products" element={<ProductsPage />} />
<Route path="/products/:id" element={<ProductDetailPage />} />
```

## 2. Thêm quản lý giỏ hàng

### Cập nhật `src/store/productStore.js`

```js
export const useProductStore = create((set, get) => ({
  cart: [],
  
  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity }] };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId),
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ),
  })),
  
  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
```

### Tạo Cart Page
File `src/pages/Cart.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { Button } from '../components/ui';
import { Trash2, Plus, Minus } from 'lucide-react';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useProductStore();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus size={20} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus size={20} />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="text-2xl font-bold mb-4">
          Total: ${getTotalPrice().toFixed(2)}
        </div>
        <Link to="/checkout" className="btn-primary w-full text-center">
          Checkout
        </Link>
      </div>
    </div>
  );
}
```

## 3. Thêm Admin Dashboard

Tạo file `src/pages/admin/Dashboard.jsx`:

```jsx
import { useEffect, useState } from 'react';
import { Loading, Card, Button } from '../../components/ui';
import { BarChart3, Users, ShoppingBag, DollarSign } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch admin statistics
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="flex items-center gap-4">
          <ShoppingBag size={40} className="text-primary-600" />
          <div>
            <p className="text-gray-600">Total Products</p>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </div>
        </Card>
        {/* More stat cards */}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Manage Products</h2>
          <Button variant="primary" className="w-full">
            Go to Products
          </Button>
        </Card>
        {/* More management options */}
      </div>
    </div>
  );
}
```

## 4. Thêm API calls mới

Cập nhật `src/api/authApi.js`:

```js
export const userAPI = {
  getProfile: async () => {
    const response = await axiosClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosClient.put('/users/profile', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await axiosClient.get('/users', { params });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },
};
```

## 5. Styling tips

### Sử dụng Tailwind classes
```jsx
// Layout
<div className="max-w-7xl mx-auto px-4 py-12">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="flex items-center justify-between">

// Typography
<h1 className="text-4xl font-bold text-gray-900">
<p className="text-sm text-gray-600">

// Colors
className="bg-primary-600 text-white"
className="bg-rose-50 text-rose-900"
className="bg-green-100 border-green-300"
```

### Custom animations
Thêm vào `src/index.css`:

```css
@layer utilities {
  .animate-bounce-slow {
    animation: bounce 2s infinite;
  }
}
```

## 6. Form validation patterns

```jsx
const validate = () => {
  const errors = {};
  
  if (!email) errors.email = 'Email required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email';
  }
  
  if (!password) errors.password = 'Password required';
  if (password.length < 6) {
    errors.password = 'Min 6 characters';
  }
  
  return errors;
};
```

## 7. Error handling pattern

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    const response = await apiCall();
    setAlert({ type: 'success', message: 'Success!' });
  } catch (error) {
    const message = error.response?.data?.message || 'Error occurred';
    setAlert({ type: 'error', message });
  } finally {
    setLoading(false);
  }
};
```

## Checklist tính năng

- [ ] Trang danh sách sản phẩm với filter
- [ ] Trang chi tiết sản phẩm
- [ ] Giỏ hàng
- [ ] Thanh toán
- [ ] Đơn hàng của tôi
- [ ] Hồ sơ người dùng
- [ ] Admin Dashboard
- [ ] Quản lý sản phẩm (CRUD)
- [ ] Quản lý đơn hàng
- [ ] Quản lý người dùng
- [ ] Đánh giá sản phẩm
- [ ] Wishlist
- [ ] Notification system

Good luck! 🚀
