# 🧸 CuddleBear Shop - Frontend

Một ứng dụng web bán gấu bông hiện đại với giao diện đẹp, xác thực đầy đủ, và quản lý quyền hạn.

## 🚀 Bắt đầu nhanh

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

Truy cập: `http://localhost:5173`

## 📁 Cấu trúc dự án

```
src/
├── api/              # 🔌 API services
├── components/       # 🎨 UI & Layout components
├── middleware/       # 🔒 Route guards
├── pages/           # 📄 Page components
├── routes/          # 🛣️  Route configuration
├── store/           # 📦 Zustand stores
├── utils/           # 🛠️  Utility functions
├── App.jsx
├── main.jsx
└── index.css        # 🎯 Tailwind CSS
```

## 🎨 Công nghệ

| Công nghệ | Mục đích |
|-----------|---------|
| **React 19** | UI Library |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **Zustand** | State Management |
| **React Router** | Navigation |
| **Axios** | HTTP Client |
| **Lucide React** | Icons |

## 🔐 Tính năng

### 👤 Xác thực
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ JWT Token
- ✅ Auto logout khi token hết hạn

### 🛒 Mua sắm
- ✅ Duyệt sản phẩm
- ✅ Giỏ hàng
- ✅ Đặt hàng
- ✅ Lịch sử đơn hàng

### 👑 Admin
- ✅ Dashboard thống kê
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng

## 🌐 API Endpoints

```
Auth:
POST   /auth/login              - Đăng nhập
POST   /auth/register           - Đăng ký
GET    /auth/me                 - Lấy thông tin
POST   /auth/logout             - Đăng xuất

Products:
GET    /products                - Danh sách
GET    /products/:id            - Chi tiết
POST   /products                - Tạo (Admin)
PUT    /products/:id            - Cập nhật (Admin)
DELETE /products/:id            - Xóa (Admin)

Orders:
GET    /orders                  - Danh sách
POST   /orders                  - Tạo
PUT    /orders/:id/status       - Cập nhật trạng thái
```

## ⚙️ Cấu hình

Tạo `.env.local`:

```env
VITE_API_URL=https://localhost:7131/api
```

## 🎯 State Management (Zustand)

### Auth Store
```js
import { useAuthStore } from '@/store/authStore';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Product Store
```js
import { useProductStore } from '@/store/productStore';

const { products, cart, addToCart, removeFromCart } = useProductStore();
```

## 🔐 Route Guards

### Protected Route (Cần đăng nhập)
```jsx
<Route path="/cart" element={
  <ProtectedRoute>
    <CartPage />
  </ProtectedRoute>
} />
```

### Admin Route
```jsx
<Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

### Public Route (Chỉ chưa đăng nhập)
```jsx
<Route path="/login" element={
  <PublicRoute>
    <LoginPage />
  </PublicRoute>
} />
```

## 💻 UI Components

### Input Field
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Button
```jsx
<Button
  variant="primary"    // primary | secondary | outline
  size="md"           // sm | md | lg
  loading={loading}
  onClick={handleClick}
>
  Click me
</Button>
```

### Card
```jsx
<Card className="p-6">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### Alert
```jsx
<Alert
  type="success"      // success | error | warning | info
  message="Success!"
  onClose={() => setAlert(null)}
/>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
</Modal>
```

## 📝 Ví dụ: Tạo trang mới

### 1. Tạo page component
```jsx
// src/pages/MyPage.jsx
export function MyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">My Page</h1>
    </div>
  );
}
```

### 2. Thêm route
```jsx
// src/routes/AppRoutes.jsx
import { MyPage } from '../pages/MyPage';

<Route path="/mypage" element={<MyPage />} />
```

### 3. Thêm link
```jsx
// src/components/layout/index.jsx
<Link to="/mypage">My Page</Link>
```

## 🎨 Tailwind CSS Tips

```jsx
// Layout
<div className="max-w-7xl mx-auto px-4 py-12">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="flex items-center justify-between">

// Colors
className="bg-primary-600 text-white"
className="bg-rose-50 text-rose-900"
className="hover:bg-primary-700"

// Responsive
className="text-sm md:text-base lg:text-lg"
className="hidden md:flex"

// Spacing
className="mb-4 md:mb-8"
className="px-4 py-2"
```

## 🐛 Debugging

### Xem Zustand state
```js
// Console
useAuthStore.getState()
useProductStore.getState()
```

### Network requests
- F12 → Network tab
- Kiểm tra API calls
- Xem response status

### Console logs
```js
console.log('Auth user:', useAuthStore.getState().user);
console.log('Cart items:', useProductStore.getState().cart);
```

## 📚 Tài liệu

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Đóng góp

Pull requests được chào đón!

## 📄 License

MIT

---

**Cần giúp đỡ?** Xem [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
