import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export function ProductCard({ product }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState(null);
  const { addToCart } = useCartStore();

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      setMessage({ type: 'error', text: 'Out of stock' });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // 🔍 Check quantity trong cart
    const cartItems = useCartStore.getState().cartItems;
    const existingItem = cartItems.find(item => item.productId === product.id);
    const totalQuantity = (existingItem?.quantity || 0) +
     1;

    // ✅ Validate: total quantity không vượt quá stock
    if (totalQuantity > product.stock) {
      setMessage({
        type: 'error',
        text: `Cannot add. Only ${product.stock - (existingItem?.quantity || 0)} available.`,
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(
        product.id,
        1,
        product.name,
        product.price,
        product.imageUrl
      );

      if (success) {
        setMessage({ type: 'success', text: 'Added to cart!' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to add to cart' });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ type: 'error', text: 'Failed to add to cart' });
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="overflow-hidden flex flex-col h-full relative cursor-pointer hover:shadow-lg transition-shadow">
        {/* Message Toast */}
        {message && (
          <div
            className={`absolute top-2 left-2 right-2 p-2 rounded text-sm font-semibold z-10 ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Image Container - Fixed Height */}
        <div className="w-full h-32 overflow-hidden relative">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/200'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content Container - Flex grow to push footer down */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Title - Fixed height */}
          <h2 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 h-10">
            {product.name}
          </h2>

          {/* Description - Flex grow to fill space */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Footer - Price and Button - Fixed at bottom */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="bg-primary-600 text-white p-1.5 rounded hover:bg-primary-700 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              title="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
