import React, { useState } from 'react';
import { 
  Package, 
  Tag, 
  ShieldCheck, 
  Star, 
  Check, 
  ShoppingBag, 
  Truck, 
  Zap,
  Percent
} from 'lucide-react';

export default function KrishiBazaar({ farmInputs = [], onBuyInput }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 
    'Fertilizers', 
    'Certified Seeds', 
    'Pesticides & Bio-control', 
    'Farm Equipment', 
    'Irrigation Systems'
  ];

  const filteredItems = farmInputs.filter(item => 
    selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
          <Percent size={14} color="#fcd34d" /> Direct Central & State Government Subsidies Applied
        </div>
        <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '8px' }}>
          Krishi Bazaar: Verified Farm Inputs & Mechanization
        </h2>
        <p style={{ color: '#dbeafe', maxWidth: '680px', fontSize: '1rem', lineHeight: 1.5 }}>
          Authorized IFFCO nano-fertilizers, NSC certified hybrid seeds, solar drip irrigation kits, and power tillers delivered straight to your farm gate.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: selectedCategory === cat ? '#1e40af' : 'white',
              color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? '#1e40af' : '#e2e8f0'}`,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="product-card">
            <div className="product-card-img-wrap">
              <img src={item.image_url} alt={item.title} className="product-card-img" />
              {item.subsidy_applicable && (
                <span className="product-tag-organic" style={{ background: '#1d4ed8' }}>
                  <Zap size={13} fill="#fcd34d" color="#fcd34d" /> {item.subsidy_percentage}% Govt Subsidy
                </span>
              )}
            </div>

            <div className="product-card-body">
              <div className="product-category-row">
                <span>{item.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#d97706', fontWeight: 700 }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" /> {item.rating}
                </span>
              </div>

              <h3 className="product-title" style={{ fontSize: '1.05rem' }}>{item.title}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Manufacturer: <strong>{item.brand}</strong>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                {item.description}
              </p>

              <div className="product-price-row">
                <div>
                  <span className="price-main" style={{ color: '#1e40af' }}>₹{item.price}</span>
                  {item.original_price && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                      ₹{item.original_price}
                    </span>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    Free Village Delivery (48 hrs)
                  </div>
                </div>

                <button 
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', fontSize: '0.85rem' }}
                  onClick={() => onBuyInput(item)}
                >
                  <ShoppingBag size={16} /> Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
