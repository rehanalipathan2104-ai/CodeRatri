import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Star, 
  MapPin, 
  Calendar, 
  Plus, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function ConsumerMarketplace({ 
  products = [], 
  onAddToCart, 
  onOpenProductDetail,
  searchQuery = '',
  setSearchQuery
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  const categories = [
    'All', 
    'Vegetables', 
    'Grains & Cereals', 
    'Fruits', 
    'Spices', 
    'Dairy & Honey', 
    'Oilseeds'
  ];

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesOrganic = !onlyOrganic || p.is_organic;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location_state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesOrganic && matchesSearch;
  });

  return (
    <div>
      {/* Hero AgriTech Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 40px',
        color: 'white',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)'
      }}>
        {/* Subtle decorative background circles */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} color="#fcd34d" /> 100% Direct Farm-to-Fork Traceability
          </div>
          <h2 style={{ fontSize: '2.4rem', color: 'white', lineHeight: 1.15, marginBottom: '12px' }}>
            Fresh Farm Produce Delivered Directly From Indian Farmers
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '24px' }}>
            Eliminate middleman margins. Guaranteed fair prices for local growers, certified organic freshness for you.
          </p>

          {/* Search Input in Hero */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '6px 8px 6px 18px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            <Search size={20} color="#059669" style={{ marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Search organic tomatoes, Sharbati wheat, Alphonso mangoes, A2 ghee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.98rem',
                color: 'var(--text-primary)',
                background: 'transparent',
                padding: '8px 0'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '0 8px' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: selectedCategory === cat ? 'var(--primary)' : 'white',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-subtle)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === cat ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Organic Toggle Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: onlyOrganic ? '#ecfdf5' : 'white',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: `1px solid ${onlyOrganic ? '#10b981' : '#e2e8f0'}`,
            color: onlyOrganic ? '#059669' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}>
            <input 
              type="checkbox" 
              checked={onlyOrganic} 
              onChange={() => setOnlyOrganic(!onlyOrganic)}
              style={{ accentColor: '#059669' }}
            />
            <ShieldCheck size={16} /> Certified Organic Only
          </label>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', background: 'white' }}>
          <ShoppingBag size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3>No produce matched your search</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Try resetting your category or search term, or explore our other farm categories.
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '20px' }}
            onClick={() => { setSelectedCategory('All'); setOnlyOrganic(false); setSearchQuery(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-card-img-wrap">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="product-card-img" 
                  loading="lazy" 
                />
                {product.is_organic && (
                  <span className="product-tag-organic">
                    <ShieldCheck size={13} /> Organic
                  </span>
                )}
                <span className="product-tag-grade">
                  {product.quality_grade}
                </span>
              </div>

              <div className="product-card-body">
                <div className="product-category-row">
                  <span>{product.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#d97706', fontWeight: 700 }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" /> {product.farmer_rating}
                  </span>
                </div>

                <h3 className="product-title" title={product.name}>
                  {product.name}
                </h3>

                <div className="product-farmer-badge">
                  <MapPin size={14} color="#059669" />
                  <span>{product.farmer_name} • {product.location_district}, {product.location_state}</span>
                </div>

                {product.harvest_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <Calendar size={13} /> Harvested on {product.harvest_date}
                  </div>
                )}

                <div className="product-price-row">
                  <div>
                    <span className="price-main">₹{product.price_per_unit}</span>
                    <span className="price-unit"> / {product.unit}</span>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                      In Stock: {product.stock_quantity} {product.unit}s
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="btn-secondary"
                      style={{ padding: '8px 10px' }}
                      title="Quick View Details"
                      onClick={() => onOpenProductDetail(product)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      onClick={() => onAddToCart(product)}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
