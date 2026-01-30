import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Loading, Alert, Button } from '../components/ui';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getById(id);
        setProduct(data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to load product details',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      setAlert({
        type: 'error',
        message: 'This product is out of stock',
      });
      return;
    }

    // 🔍 Check quantity trong cart
    const cartItems = useCartStore.getState().cartItems;
    const existingItem = cartItems.find(item => item.productId === product.id);
    const totalQuantity = (existingItem?.quantity || 0) + quantity;

    // ✅ Validate: total quantity không vượt quá stock
    if (totalQuantity > product.stock) {
      setAlert({
        type: 'error',
        message: `Cannot add. You already have ${existingItem?.quantity || 0} in cart. Only ${product.stock - (existingItem?.quantity || 0)} more available.`,
      });
      return;
    }

    setAddingToCart(true);
    try {
      console.log('Adding to cart:', {
        productId: product.id,
        quantity,
        existingQuantity: existingItem?.quantity || 0,
        totalQuantity,
        stock: product.stock,
      });

      const success = await addToCart(
        product.id,
        quantity,
        product.name,
        product.price,
        product.imageUrl
      );

      console.log('Add to cart result:', success);

      if (success) {
        setAlert({
          type: 'success',
          message: `Added ${quantity} ${product.name} to cart!`,
        });
        setQuantity(1);
      } else {
        setAlert({
          type: 'error',
          message: 'Failed to add product to cart',
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to add product to cart',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Category map
  const categoryMap = {
    1: 'Gấu Teddy',
    2: 'Gấu Hoạt Hình',
    3: 'Gấu Đôi',
    4: 'Gấu Sinh Nhật',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
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

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating || 4.5} ({product.reviews || 128} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary-600 mb-6">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Category & Stock */}
            <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">
                  {categoryMap[product.categoryId] || `Category ${product.categoryId}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Availability</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      // 🔍 Check quantity trong cart
                      const cartItems = useCartStore.getState().cartItems;
                      const existingItem = cartItems.find(item => item.productId === product.id);
                      const cartQuantity = existingItem?.quantity || 0;
                      const maxAvailable = product.stock - cartQuantity;

                      // ✅ Cho phép tăng nếu chưa đạt max
                      if (quantity < maxAvailable) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                    disabled={(() => {
                      const cartItems = useCartStore.getState().cartItems;
                      const existingItem = cartItems.find(item => item.productId === product.id);
                      const cartQuantity = existingItem?.quantity || 0;
                      const maxAvailable = product.stock - cartQuantity;
                      return quantity >= maxAvailable;
                    })()}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {(() => {
                    const cartItems = useCartStore.getState().cartItems;
                    const existingItem = cartItems.find(item => item.productId === product.id);
                    const cartQuantity = existingItem?.quantity || 0;
                    const maxAvailable = product.stock - cartQuantity;
                    return cartQuantity > 0
                      ? `/ ${maxAvailable} more available (${cartQuantity} in cart)`
                      : `/ ${product.stock} available`;
                  })()}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className={`w-full ${
                  product.stock === 0 || addingToCart
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2`}
              >
                <ShoppingCart size={20} />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products Section (optional) */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
          <p className="text-gray-600">Related products coming soon...</p>
        </div>
      </section>
    </div>
  );
}
