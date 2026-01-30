import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { Star, ShoppingCart } from 'lucide-react';

export function ProductCard({ product }) {
  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
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
          <Link
            to={`/products/${product.id}`}
            className="bg-primary-600 text-white p-1.5 rounded hover:bg-primary-700 transition flex items-center justify-center"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
