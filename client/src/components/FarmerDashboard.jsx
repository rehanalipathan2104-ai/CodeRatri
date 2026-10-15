import React, { useState } from 'react';
import { 
  Sprout, 
  PlusCircle, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertCircle, 
  Check, 
  Trash2, 
  Activity, 
  Layers, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function FarmerDashboard({ 
  products = [], 
  onAddProduct, 
  onDeleteProduct, 
  onNavigateToDisease, 
  onNavigateToMsp,
  orders = []
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price_per_unit: '',
    unit: 'kg',
    stock_quantity: '',
    min_order_quantity: '1',
    description: '',
    is_organic: true,
    is_bulk_only: false,
    quality_grade: 'Grade A+',
    location_state: 'Maharashtra',
    location_district: 'Nashik',
    image_url: ''
  });

  // Calculate Farmer KPI Stats
  const farmerProducts = products.filter(p => p.farmer_id === 'usr-farmer-1' || !p.farmer_id);
  const totalStockKg = farmerProducts.reduce((acc, p) => acc + Number(p.stock_quantity || 0), 0);
  const estimatedValue = farmerProducts.reduce((acc, p) => acc + (Number(p.price_per_unit || 0) * Number(p.stock_quantity || 0)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price_per_unit) return;

    // Default image if empty based on category
    let defaultImg = formData.image_url;
    if (!defaultImg) {
      if (formData.category === 'Vegetables') defaultImg = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80';
      else if (formData.category === 'Grains & Cereals') defaultImg = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
      else if (formData.category === 'Fruits') defaultImg = 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80';
      else defaultImg = 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80';
    }

    onAddProduct({
      ...formData,
      image_url: defaultImg,
      farmer_id: 'usr-farmer-1',
      farmer_name: 'Rajesh Patel',
      farmer_state: formData.location_state,
      farmer_rating: 4.9
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'Vegetables',
      price_per_unit: '',
      unit: 'kg',
      stock_quantity: '',
      min_order_quantity: '1',
      description: '',
      is_organic: true,
      is_bulk_only: false,
      quality_grade: 'Grade A+',
      location_state: 'Maharashtra',
      location_district: 'Nashik',
      image_url: ''
    });
  };

  return (
    <div>
      {/* Farmer Welcome Header */}
      <div className="section-header">
        <div>
          <h2>
            <Sprout color="#059669" size={32} /> Farmer Command Center
          </h2>
          <p className="section-subtitle">
            Welcome, <strong>Rajesh Patel</strong> (GreenField Organic Orchards, Nashik) • Aadhaar & Agmark Verified
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-secondary"
            onClick={onNavigateToDisease}
          >
            <Activity size={18} color="#ef4444" /> Crop Disease Doctor
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <PlusCircle size={18} /> Add Crop Produce Listing
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Listings</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {farmerProducts.length} Crops
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <Check size={14} /> 100% Verified in Marketplace
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Inventory Volume</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalStockKg.toLocaleString()} Units
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Real-time live warehouse & cold storage
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Inventory Valuation</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>
            ₹{estimatedValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <TrendingUp size={14} /> +24% above traditional APMC middleman
          </div>
        </div>

        {/* Card 4: Price Intelligence */}
        <div className="glass-panel" style={{ 
          padding: '24px', 
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600 }}>MSP Price Intelligence</span>
            <Sparkles size={18} color="#fcd34d" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3 }}>
            Tomato & Onion prices UP by 22%
          </div>
          <p style={{ fontSize: '0.8rem', color: '#d1fae5', marginTop: '6px', marginBottom: '12px' }}>
            Favorable window to liquidate fresh stock on open portal.
          </p>
          <button 
            onClick={onNavigateToMsp}
            style={{ 
              color: '#fcd34d', 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}
          >
            Check Government MSP Benchmarks <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Produce Listings Table */}
      <div className="glass-panel" style={{ background: 'white', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Your Current Farm Listings</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Price / Unit</th>
                <th style={{ padding: '12px 16px' }}>In Stock</th>
                <th style={{ padding: '12px 16px' }}>Grade</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmerProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={p.image_url} 
                      alt={p.name} 
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.location_district}, {p.location_state}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{p.category}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>₹{p.price_per_unit} / {p.unit}</td>
                  <td style={{ padding: '12px 16px' }}>{p.stock_quantity} {p.unit}s</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      background: '#ecfdf5',
                      color: '#059669'
                    }}>
                      {p.quality_grade || 'Grade A'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: '#059669', 
                      fontSize: '0.82rem', 
                      fontWeight: 600 
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onDeleteProduct(p.id)}
                      style={{ color: '#ef4444', padding: '6px', borderRadius: '6px' }}
                      title="Delete listing"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Produce Listing Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Add New Produce Listing</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ fontSize: '1.2rem', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Crop / Produce Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Organic Pomegranates (Bhagwa Variety)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Spices">Spices</option>
                    <option value="Dairy & Honey">Dairy & Honey</option>
                    <option value="Oilseeds">Oilseeds</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Selling Unit *
                  </label>
                  <select 
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="kg">Per kg</option>
                    <option value="quintal">Per quintal (100 kg)</option>
                    <option value="box">Per Box</option>
                    <option value="litre">Per Litre</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Price (₹) *
                  </label>
                  <input 
                    type="number" 
                    step="0.5"
                    required
                    placeholder="e.g. 55"
                    value={formData.price_per_unit}
                    onChange={e => setFormData({ ...formData, price_per_unit: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Stock Quantity *
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 2500"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Description & Quality Notes
                </label>
                <textarea 
                  rows="3"
                  placeholder="Detail farming techniques, soil health, and freshness..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_organic}
                    onChange={e => setFormData({ ...formData, is_organic: e.target.checked })}
                    style={{ accentColor: '#059669' }}
                  />
                  100% Certified Organic
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.is_bulk_only}
                    onChange={e => setFormData({ ...formData, is_bulk_only: e.target.checked })}
                    style={{ accentColor: '#059669' }}
                  />
                  Industry B2B Bulk Listing
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
