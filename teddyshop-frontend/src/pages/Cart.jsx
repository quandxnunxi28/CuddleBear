import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Loading, Alert, Button } from '../components/ui';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { productAPI } from '../api/authApi';

export function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const [alert, setAlert] = useState(null);
  const [productStocks, setProductStocks] = useState({});

  // 🔍 Fetch product data để lấy stock info
  useEffect(() => {
    const fetchProductStocks = async () => {
      try {
        const stocks = {};
        for (const item of cartItems) {
          if (!productStocks[item.productId]) {
            const product = await productAPI.getById(item.productId);
            stocks[item.productId] = product.stock;
          }
        }
        setProductStocks(prev => ({ ...prev, ...stocks }));
      } catch (error) {
        console.error('Failed to fetch product stocks:', error);
      }
    };

    if (cartItems.length > 0) {
      fetchProductStocks();
    }
  }, [cartItems]);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // 🔍 Get stock from productStocks
    const stock = productStocks[productId];
    
    // ✅ Validate quantity
    if (stock && newQuantity > stock) {
      setAlert({
        type: 'error',
        message: `Cannot set quantity to ${newQuantity}. Only ${stock} available.`,
      });
      return;
    }
    
    const success = await updateQuantity(productId, newQuantity);
    if (!success) {
      setAlert({
        type: 'error',
        message: 'Failed to update quantity',
      });
    }
  };

  const handleRemove = async (productId) => {
    const success = await removeFromCart(productId);
    if (success) {
      setAlert({
        type: 'success',
        message: 'Product removed from cart',
      });
    } else {
      setAlert({
        type: 'error',
        message: 'Failed to remove product',
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const success = await clearCart();
      if (success) {
        setAlert({
          type: 'success',
          message: 'Cart cleared',
        });
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setAlert({
        type: 'error',
        message: 'Your cart is empty',
      });
      return;
    }
    // TODO: Navigate to checkout page
    navigate('/checkout');
  };

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => {}}
          />
        )}

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding some adorable teddy bears to your cart!
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-6 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/100'}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-primary-600 font-bold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.quantity - 1)
                          }
                          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition disabled:text-gray-300 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.quantity + 1)
                          }
                          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition disabled:text-gray-300 disabled:cursor-not-allowed"
                          disabled={item.quantity >= (productStocks[item.productId] || 0)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      {/* Stock info */}
                      <span className="text-xs text-gray-600 text-center">
                        {productStocks[item.productId] 
                          ? `${productStocks[item.productId]} available`
                          : 'Loading...'}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cartItems.length > 0 && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm transition"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(0)}
                  </span>
                </div>

                {/* Tax (if any) */}
                <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(0)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Items Count */}
                <p className="text-sm text-gray-600 mb-6 text-center">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart
                </p>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block text-center text-primary-600 hover:text-primary-700 font-semibold mt-4 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
