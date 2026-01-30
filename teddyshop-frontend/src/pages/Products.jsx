import { useEffect, useState } from 'react';
import { productAPI } from '../api/authApi';
import { Loading, Alert } from '../components/ui';
import { ProductCard } from '../components/product/ProductCard';
import { Search } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        setProducts(data);
        setFilteredProducts(data);
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

  useEffect(() => {
    let filtered = products;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'all' && products.length > 0) {
      filtered = filtered.filter((product) => product.categoryId === parseInt(category));
    }

    // Filter only active products
    filtered = filtered.filter((product) => product.isActive !== false);

    setFilteredProducts(filtered);
  }, [search, category, products]);

  // Category map
  const categoryMap = {
    1: 'Gấu Teddy',
    2: 'Gấu Hoạt Hình',
    3: 'Gấu Đôi',
    4: 'Gấu Sinh Nhật',
  };

  // Get unique categories from active products
  const categories = [
    'all',
    ...new Set(
      products
        .filter((p) => p.isActive)
        .map((p) => p.categoryId)
        .filter(Boolean)
    ),
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-rose-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Shop Products</h1>
          <p className="text-white/90">Browse our collection of adorable teddy bears</p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : categoryMap[cat] || `Category ${cat}`}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 mt-3">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
