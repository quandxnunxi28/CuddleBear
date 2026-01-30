import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Loading, Alert, Button } from '../components/ui';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (product.stock === 0) {
      setAlert({
        type: 'error',
        message: 'This product is out of stock',
      });
      return;
    }
    setAlert({
      type: 'success',
      message: `Added ${quantity} ${product.name} to cart!`,
    });
    setQuantity(1);
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                } text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2`}
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center">
                  Please log in to add items to your cart
                </p>
              )}
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
