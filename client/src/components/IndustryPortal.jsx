import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  Send, 
  Download, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function IndustryPortal({ 
  products = [], 
  quotes = [], 
  contracts = [], 
  onSubmitRfq, 
  onUpdateQuote 
}) {
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog', 'quotes', 'contracts'
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [selectedProductForRfq, setSelectedProductForRfq] = useState(null);

  const [rfqForm, setRfqForm] = useState({
    product_name: '',
    crop_category: 'Grains & Cereals',
    quantity_requested: '100',
    unit: 'quintal (10,000 kg)',
    target_price_per_unit: '3200',
    specifications: 'Moisture < 11%, zero foreign matter, food-grade packaging.',
    delivery_timeline_days: '14'
  });

  // Filter bulk-eligible crops
  const bulkProducts = products.filter(p => p.stock_quantity > 100 || p.is_bulk_only);

  const handleOpenRfqForProduct = (prod) => {
    setSelectedProductForRfq(prod);
    setRfqForm({
      product_name: prod.name,
      crop_category: prod.category,
      quantity_requested: '100',
      unit: 'quintal',
      target_price_per_unit: Math.round(prod.price_per_unit * 90), // bulk discount price per quintal
      specifications: 'Industry standard quality for processing and commercial packaging.',
      delivery_timeline_days: '12'
    });
    setShowRfqModal(true);
  };

  const handleRfqSubmit = (e) => {
    e.preventDefault();
    onSubmitRfq({
      ...rfqForm,
      farmer_id: selectedProductForRfq ? selectedProductForRfq.farmer_id : 'usr-farmer-2',
      farmer_name: selectedProductForRfq ? selectedProductForRfq.farmer_name : 'Sardar Gurpreet Singh'
    });
    setShowRfqModal(false);
  };

  return (
    <div>
      {/* Industry Banner */}
      <div className="section-header">
        <div>
          <h2>
            <Briefcase color="#0284c7" size={32} /> B2B Industry Procurement Portal
          </h2>
          <p className="section-subtitle">
            Direct wholesale sourcing for food processors, millers, exporters, and retail chains.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="role-pill-group">
          <button 
            className={`role-pill-btn ${activeSubTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('catalog')}
          >
            <Layers size={16} /> Bulk Catalog
          </button>
          <button 
            className={`role-pill-btn ${activeSubTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('quotes')}
          >
            <Clock size={16} /> RFQs & Quotes ({quotes.length})
          </button>
          <button 
            className={`role-pill-btn ${activeSubTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('contracts')}
          >
            <FileText size={16} /> Digital Contracts ({contracts.length})
          </button>
        </div>
      </div>

      {/* 1. Bulk Catalog View */}
      {activeSubTab === 'catalog' && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
            color: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>
                <ShieldCheck size={14} color="#7dd3fc" /> Escrow-Protected Settlement
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'white', marginBottom: '8px' }}>
                Wholesale Agricultural Sourcing at Scale
              </h3>
              <p style={{ color: '#e0f2fe', fontSize: '0.95rem' }}>
                Procure truckloads of certified grains, pulses, oilseeds and spices directly from verified farmer clusters. No commission markup.
              </p>
            </div>
            <button 
              className="btn-gold"
              onClick={() => {
                setSelectedProductForRfq(null);
                setShowRfqModal(true);
              }}
            >
              <Send size={16} /> Post Custom RFQ Requirement
            </button>
          </div>

          <div className="product-grid">
            {bulkProducts.map(prod => (
              <div key={prod.id} className="product-card">
                <div className="product-card-img-wrap">
                  <img src={prod.image_url} alt={prod.name} className="product-card-img" />
                  <span className="product-tag-grade">
                    Wholesale Bulk Lot
                  </span>
                </div>
                <div className="product-card-body">
                  <div className="product-category-row">
                    <span>{prod.category}</span>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>
                      Avail: {prod.stock_quantity.toLocaleString()} {prod.unit}s
                    </span>
                  </div>
                  <h3 className="product-title">{prod.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Grower: <strong>{prod.farmer_name}</strong> ({prod.location_state})
                  </div>
                  <div style={{
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}>
                    Min Order: <strong>{prod.min_order_quantity} {prod.unit}s</strong>
                  </div>
                  <div className="product-price-row">
                    <div>
                      <span className="price-main" style={{ color: '#0284c7' }}>₹{prod.price_per_unit}</span>
                      <span className="price-unit"> / {prod.unit}</span>
                    </div>
                    <button 
                      className="btn-primary"
                      style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', fontSize: '0.85rem' }}
                      onClick={() => handleOpenRfqForProduct(prod)}
                    >
                      Request Quote (RFQ)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. RFQ Quotes & Negotiation View */}
      {activeSubTab === 'quotes' && (
        <div className="glass-panel" style={{ background: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Active Requests for Quotation (RFQs)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Track negotiated bids, counter-offers, and status conversion with farmers.
              </p>
            </div>
            <button 
              className="btn-primary"
              style={{ background: '#0284c7', fontSize: '0.85rem' }}
              onClick={() => setShowRfqModal(true)}
            >
              + Create New RFQ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quotes.map(q => (
              <div 
                key={q.id} 
                style={{ 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  background: q.status === 'converted_to_contract' ? '#f0fdf4' : 'white'
                }}
              >
                <div style={{ maxWidth: '520px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>{q.id}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: q.status === 'converted_to_contract' ? '#dcfce7' : q.status === 'negotiating' ? '#fef3c7' : '#e0f2fe',
                      color: q.status === 'converted_to_contract' ? '#166534' : q.status === 'negotiating' ? '#92400e' : '#0369a1'
                    }}>
                      {q.status === 'converted_to_contract' ? 'Contract Formed & Active' : q.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{q.product_name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Farmer: <strong>{q.farmer_name}</strong> • Volume: <strong>{q.quantity_requested} {q.unit}</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Specs: {q.specifications}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Price / Proposed Price</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{q.target_price_per_unit} / ₹{q.proposed_price_per_unit || q.target_price_per_unit}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    Est. Total: ₹{((q.quantity_requested || 0) * (q.proposed_price_per_unit || q.target_price_per_unit || 0)).toLocaleString()}
                  </div>

                  {q.status === 'negotiating' && (
                    <button 
                      className="btn-primary"
                      style={{ marginTop: '10px', fontSize: '0.82rem', padding: '6px 14px' }}
                      onClick={() => onUpdateQuote(q.id, 'converted_to_contract')}
                    >
                      Accept & Convert to Contract
                    </button>
                  )}
                  {q.status === 'converted_to_contract' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#166534', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>
                      <CheckCircle size={16} /> Escrow Funded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Digital Contracts & Legal Invoicing View */}
      {activeSubTab === 'contracts' && (
        <div className="glass-panel" style={{ background: 'white', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Executed Legal Contracts & Invoices</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Aadhaar eSign & Corporate digital signature verified contracts with automated GST invoices.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {contracts.map(c => (
              <div 
                key={c.id}
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px',
                  background: '#fcfdfd'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>{c.id}</span>
                      <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        ACTIVE & BINDING
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem' }}>{c.contract_title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Buyer: <strong>{c.buyer_name}</strong> | Seller: <strong>{c.farmer_name}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Contract Value</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{c.total_contract_value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                      Advance: ₹{c.advance_amount.toLocaleString()} ({c.advance_status})
                    </div>
                  </div>
                </div>

                {/* Contract Specs Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem', marginBottom: '18px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Volume:</span>
                    <div style={{ fontWeight: 600 }}>{c.total_volume}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery Deadline:</span>
                    <div style={{ fontWeight: 600 }}>{c.delivery_deadline}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Invoice No:</span>
                    <div style={{ fontWeight: 600 }}>{c.invoice_number}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Applicable GST (5%):</span>
                    <div style={{ fontWeight: 600 }}>₹{c.gst_amount.toLocaleString()}</div>
                  </div>
                </div>

                {/* Digital Signatures */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <ShieldCheck size={14} color="#059669" style={{ display: 'inline', marginRight: '4px' }} />
                    Digital Signature: {c.digital_signature_buyer} & {c.digital_signature_farmer}
                  </div>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => alert(`Downloading GST Compliant Invoice ${c.invoice_number}...`)}
                  >
                    <Download size={14} /> Download Tax Invoice PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post RFQ Modal */}
      {showRfqModal && (
        <div className="modal-overlay" onClick={() => setShowRfqModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Submit B2B Bulk RFQ</h3>
              <button onClick={() => setShowRfqModal(false)} style={{ fontSize: '1.2rem', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleRfqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Crop Commodity *</label>
                <input 
                  type="text" 
                  required
                  value={rfqForm.product_name}
                  onChange={e => setRfqForm({ ...rfqForm, product_name: e.target.value })}
                  placeholder="e.g. Sharbati Golden Wheat"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Volume (Quintals) *</label>
                  <input 
                    type="number" 
                    required
                    value={rfqForm.quantity_requested}
                    onChange={e => setRfqForm({ ...rfqForm, quantity_requested: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Target Price / Quintal (₹) *</label>
                  <input 
                    type="number" 
                    required
                    value={rfqForm.target_price_per_unit}
                    onChange={e => setRfqForm({ ...rfqForm, target_price_per_unit: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Quality Specifications</label>
                <textarea 
                  rows="3"
                  value={rfqForm.specifications}
                  onChange={e => setRfqForm({ ...rfqForm, specifications: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRfqModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: '#0284c7' }}>Broadcast RFQ to Farmers</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
