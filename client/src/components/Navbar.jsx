import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingCart, 
  Bell, 
  User, 
  TrendingUp, 
  Briefcase, 
  Store, 
  Activity, 
  Package, 
  Info,
  DollarSign
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
  onOpenRoadmap,
  onOpenRevenue,
  mspRates = [] 
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'MSP Rate Update', desc: 'Wheat MSP updated to ₹2,425/quintal for 2026-27 season.', time: '10m ago' },
    { id: 2, title: 'New RFQ Received', desc: 'AgroCorp Foods requested quote for 250 quintals Wheat.', time: '1h ago' },
    { id: 3, title: 'Order Dispatched', desc: 'Order ORD-2026-9041 has arrived at Delhi Cold-Chain Hub.', time: '3h ago' }
  ];

  return (
    <header className="glass-nav">
      {/* Top Mandi & MSP Live Ticker */}
      <div className="mandi-ticker-bar">
        <span className="ticker-title-tag">
          <Activity size={12} /> Live APMC Mandi Rates
        </span>
        <div className="ticker-marquee">
          {mspRates.map((item, idx) => (
            <div key={idx} className="ticker-item">
              <strong>{item.commodity}:</strong>
              <span>Mandi ₹{item.mandi_avg_price}/qtl</span>
              <span className={item.trend === 'up' ? 'ticker-up' : 'ticker-stable'}>
                {item.trend === 'up' ? `▲ +${item.trend_percentage}%` : '● Stable'}
              </span>
              <span style={{ opacity: 0.6 }}>|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="brand-wrapper" onClick={() => setActiveTab('marketplace')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-box">
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <h1>KisanSetu</h1>
            <span>Digital Marketplace for Farmers</span>
          </div>
        </div>

        {/* Role Switcher Pill Group */}
        <div className="role-pill-group">
          <button 
            className={`role-pill-btn ${currentRole === 'farmer' ? 'active' : ''}`}
            onClick={() => {
              setCurrentRole('farmer');
              setActiveTab('farmer');
            }}
          >
            <Sprout size={16} /> Farmer
          </button>
          <button 
            className={`role-pill-btn ${currentRole === 'consumer' ? 'active' : ''}`}
            onClick={() => {
              setCurrentRole('consumer');
              setActiveTab('marketplace');
            }}
          >
            <Store size={16} /> Consumer
          </button>
          <button 
            className={`role-pill-btn ${currentRole === 'industry' ? 'active' : ''}`}
            onClick={() => {
              setCurrentRole('industry');
              setActiveTab('industry');
            }}
          >
            <Briefcase size={16} /> Industry B2B
          </button>
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Revenue Model Button */}
          <button 
            className="btn-secondary" 
            style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            onClick={onOpenRevenue}
            title="View Platform Monetization & Revenue"
          >
            <DollarSign size={16} color="#059669" /> Revenue Model
          </button>

          {/* Roadmap Button */}
          <button 
            className="btn-secondary" 
            style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            onClick={onOpenRoadmap}
            title="View Implementation Roadmap"
          >
            <Info size={16} color="#f59e0b" /> Roadmap
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-badge-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={20} />
              <span className="badge-count">3</span>
            </button>

            {showNotifications && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '320px',
                padding: '16px',
                background: 'white',
                zIndex: 200,
                boxShadow: 'var(--shadow-xl)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem' }}>Alerts & Notifications</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button 
            className="icon-badge-btn" 
            onClick={onOpenCart}
            title="View Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>

          {/* User Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px', 
            background: 'white', 
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <div style={{
              width: '26px', 
              height: '26px', 
              borderRadius: '50%', 
              background: '#ecfdf5', 
              color: '#059669', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <User size={15} />
            </div>
            <span>{currentRole === 'farmer' ? 'Rajesh Patel (Farmer)' : currentRole === 'industry' ? 'AgroCorp (Buyer)' : 'Priya (Consumer)'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="app-tabs-container">
        <button 
          className={`app-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <Store size={18} /> Fresh Produce Market
        </button>

        <button 
          className={`app-tab-btn ${activeTab === 'farmer' ? 'active' : ''}`}
          onClick={() => setActiveTab('farmer')}
        >
          <Sprout size={18} /> Farmer Dashboard
        </button>

        <button 
          className={`app-tab-btn ${activeTab === 'industry' ? 'active' : ''}`}
          onClick={() => setActiveTab('industry')}
        >
          <Briefcase size={18} /> B2B Industry Portal
        </button>

        <button 
          className={`app-tab-btn ${activeTab === 'disease' ? 'active' : ''}`}
          onClick={() => setActiveTab('disease')}
        >
          <Activity size={18} /> AI Health & Disease Lab
        </button>

        <button 
          className={`app-tab-btn ${activeTab === 'krishi-bazaar' ? 'active' : ''}`}
          onClick={() => setActiveTab('krishi-bazaar')}
        >
          <Package size={18} /> Krishi Bazaar (Inputs)
        </button>

        <button 
          className={`app-tab-btn ${activeTab === 'msp' ? 'active' : ''}`}
          onClick={() => setActiveTab('msp')}
        >
          <TrendingUp size={18} /> MSP & Mandi Rates
        </button>
      </div>
    </header>
  );
}
