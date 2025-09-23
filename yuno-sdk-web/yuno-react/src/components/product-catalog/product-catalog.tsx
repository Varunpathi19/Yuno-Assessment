import React, { useState, useMemo, useCallback } from 'react';
import { ProductCard, Cart, Checkout, type Product } from './index';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    description: 'Ultra-soft 100% organic cotton t-shirt with modern fit',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&q=80',
    category: 'Tops',
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: '2',
    name: 'Slim Fit Denim Jeans',
    price: 89.99,
    description: 'Premium stretch denim with perfect slim fit and comfort',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop&q=80',
    category: 'Bottoms',
    rating: 4.8,
    reviews: 203,
    inStock: true
  },
  {
    id: '3',
    name: 'Oversized Hoodie',
    price: 59.99,
    description: 'Trendy oversized hoodie with premium fleece lining',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80',
    category: 'Tops',
    rating: 4.6,
    reviews: 98,
    inStock: true
  },
  {
    id: '4',
    name: 'Floral Summer Dress',
    price: 69.99,
    description: 'Elegant floral print dress perfect for warm weather',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&q=80',
    category: 'Bottoms',
    rating: 4.5,
    reviews: 87,
    inStock: true
  },
  {
    id: '5',
    name: 'Genuine Leather Jacket',
    price: 249.99,
    description: 'Handcrafted genuine leather jacket with classic styling',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
    category: 'Outerwear',
    rating: 4.9,
    reviews: 124,
    inStock: false
  },
  {
    id: '6',
    name: 'Chino Shorts',
    price: 39.99,
    description: 'Classic chino shorts with modern tailored fit',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&q=80',
    category: 'Bottoms',
    rating: 4.4,
    reviews: 67,
    inStock: true
  },
  {
    id: '7',
    name: 'Denim White T-shirt',
    price: 149.99,
    description: 'Stylish white t-shirt with a modern fit',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    category: 'Tops',
    rating: 4.7,
    reviews: 89,
    inStock: true
  },
  {
    id: '8',
    name: 'Cashmere Sweater',
    price: 99.99,
    description: 'Luxurious cashmere blend sweater for ultimate comfort',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&q=80',
    category: 'Tops',
    rating: 4.8,
    reviews: 112,
    inStock: true
  },
  {
    id: '9',
    name: 'Elegant Evening Dress',
    price: 129.99,
    description: 'Sophisticated evening dress for special occasions',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&q=80',
    category: 'Dresses',
    rating: 4.6,
    reviews: 73,
    inStock: false
  },
  {
    id: '10',
    name: 'Tactical Cargo Pants',
    price: 79.99,
    description: 'Durable tactical cargo pants with reinforced stitching',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop&q=80',
    category: 'Bottoms',
    rating: 4.5,
    reviews: 45,
    inStock: true
  }
];

export const ProductCatalog: React.FC = () => {
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCheckout, setShowCheckout] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mockProducts.map(product => product.category)));
    return ['All', ...uniqueCategories];
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  // Add to cart function
  const addToCart = useCallback((product: Product) => {
    if (!product.inStock) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  }, []);

  // Remove from cart function
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  // Update quantity function
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart function
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Handle checkout
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  }, [cart]);

  // Handle checkout completion
  const handleCheckoutComplete = useCallback(() => {
    setShowCheckout(false);
    setCart([]);
  }, []);

  return (
    <div className="catalog-container">
      {/* Header */}
      <header className="catalog-header">
        <div className="catalog-header-content">
          <div className="catalog-header-left">
            <h1 className="catalog-title">🛒 Yunique Fashion Store</h1>
          </div>
          <div className="catalog-header-right">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">
                <span>🔍</span>
              </div>
            </div>
            <div className="cart-count">
              {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
            </div>
          </div>
        </div>
      </header>

      <div className="catalog-main">
        {/* Filters and Sorting */}
        <div className="filters-container">
          <div className="filters-content">
            <div className="filters-left">
              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="filter-group">
                <label className="filter-label">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                  className="filter-select"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="filter-group">
                <label className="filter-label">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="filter-select"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="results-count">
              {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        <div className="catalog-layout">
          {/* Products Grid */}
          <div className="products-section">
            <div className="products-grid">
              {filteredAndSortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
            
            {filteredAndSortedProducts.length === 0 && (
              <div className="no-products">
                <div className="no-products-icon">🔍</div>
                <h3 className="no-products-title">No products found</h3>
                <p className="no-products-description">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="cart-sidebar">
            <Cart
              cart={cart}
              totalPrice={totalPrice}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          cart={cart}
          totalPrice={totalPrice}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}; 