# CuddleBear Shop - Frontend

Một ứng dụng web bán gấu bông hiện đại với đầy đủ tính năng xác thực, phân quyền và quản lý giỏ hàng.

## Công nghệ sử dụng

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Cấu trúc dự án

```
src/
├── api/                    # API services
│   └── authApi.js         # Auth, Product, Order APIs
│
├── components/            # UI components
│   ├── ui/               # Reusable UI components
│   │   └── index.jsx     # Input, Button, Card, Modal, Alert
│   └── layout/           # Layout components
│       └── index.jsx     # Header, Footer
│
├── middleware/           # Route guards
│   └── ProtectedRoute.jsx # Auth protection
│
├── pages/                # Page components
│   ├── Home.jsx         # Homepage
│   └── auth/
│       ├── Login.jsx    # Login page
│       └── Register.jsx # Registration page
│
├── routes/              # Routes configuration
│   └── AppRoutes.jsx   # All routes
│
├── store/               # Zustand stores
│   ├── authStore.js    # Auth state
│   └── productStore.js # Product state
│
├── utils/              # Utilities
│   └── axiosClient.js  # Axios instance
│
├── App.jsx
├── main.jsx
└── index.css          # Tailwind CSS
```

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Biến môi trường

Tạo file `.env.local`:

```env
VITE_API_URL=https://localhost:7131/api
```

## Tính năng

✅ Đăng nhập / Đăng ký
✅ Xác thực JWT
✅ Phân quyền (Admin/User)
✅ Quản lý giỏ hàng
✅ Danh sách sản phẩm
✅ Chi tiết sản phẩm
✅ Đặt hàng
✅ Admin Dashboard
✅ Quản lý người dùng
✅ Quản lý sản phẩm

## API Endpoints

### Auth
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/me` - Lấy thông tin user
- `POST /auth/logout` - Đăng xuất

### Products
- `GET /products` - Danh sách sản phẩm
- `GET /products/:id` - Chi tiết sản phẩm
- `POST /products` - Tạo sản phẩm (Admin)
- `PUT /products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /orders` - Danh sách đơn hàng
- `GET /orders/:id` - Chi tiết đơn hàng
- `POST /orders` - Tạo đơn hàng
- `PUT /orders/:id/status` - Cập nhật trạng thái

## Thành phần chính

### AuthStore (Zustand)
Quản lý trạng thái đăng nhập, token và thông tin user.

```js
const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### ProductStore (Zustand)
Quản lý danh sách sản phẩm và giỏ hàng.

```js
const { products, cart, setProducts, addToCart } = useProductStore();
```

### UI Components
- `Input` - Input field với validation
- `Button` - Button với loading state
- `Card` - Card component
- `Modal` - Modal dialog
- `Alert` - Alert messages
- `Loading` - Loading spinner

### Route Guards
- `ProtectedRoute` - Yêu cầu đăng nhập
- `AdminRoute` - Yêu cầu quyền Admin
- `PublicRoute` - Chỉ cho user chưa đăng nhập

## Phát triển

### Thêm trang mới

1. Tạo component trong `src/pages/`
2. Thêm route trong `src/routes/AppRoutes.jsx`
3. Sử dụng route guards nếu cần

### Thêm API call

1. Thêm function trong `src/api/authApi.js`
2. Sử dụng `axiosClient` (tự động thêm token)
3. Handle errors và responses

### Styling

- Sử dụng Tailwind CSS classes
- Custom classes trong `src/index.css`
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`

## Troubleshooting

**API 401 Unauthorized?**
- Token đã hết hạn, cần đăng nhập lại
- Interceptor sẽ tự động redirect tới login

**CORS errors?**
- Backend cần cấu hình CORS
- Kiểm tra `VITE_API_URL` trong `.env.local`

**Tailwind CSS không áp dụng?**
- Rebuild: `npm run dev`
- Kiểm tra `tailwind.config.js` content paths

## License

MIT
