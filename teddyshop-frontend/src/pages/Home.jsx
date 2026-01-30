import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api/authApi';
import { Loading, Alert } from '../components/ui';
import { ProductCard } from '../components/product/ProductCard';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll({ limit: 8 });
        setProducts(data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to load products',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to CuddleBear 🧸</h1>
          <p className="text-xl text-white/90 mb-8">
            Discover the coziest teddy bears and cuddle buddies
          </p>
          <Link
            to="/products"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to find your perfect cuddle buddy?
          </h2>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
