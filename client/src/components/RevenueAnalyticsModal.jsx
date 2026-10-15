import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Award, 
  BarChart, 
  Layers,
  PieChart
} from 'lucide-react';

export default function RevenueAnalyticsModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/analytics')
        .then(res => res.json())
        .then(json => {
          if (json.success) setStats(json.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const revenueStreams = [
    {
      title: '2.0% Marketplace Transaction Commission',
      desc: 'Collected on every completed direct consumer sale and bulk B2B procurement contract. Covers payment processing and cold-chain escrow guarantees.',
      share: '64% of Platform Revenue',
      badge: 'Core Revenue'
    },
    {
      title: 'Industry Buyer B2B Enterprise Subscriptions',
      desc: 'Tiered annual plans (₹25,000/yr) for food processors, millers, and corporate FMCGs for priority RFQ matching, dedicated cold storage allocations, and API telemetry.',
      share: '22% of Platform Revenue',
      badge: 'SaaS Recurring'
    },
    {
      title: 'Krishi Bazaar Manufacturer Listing & Ad Margin',
      desc: '1.5% - 3.5% distribution margin on subsidized input sales (Nano Urea, certified seeds, drip kits) with featured ad positioning for authorized agri-brands.',
      share: '10% of Platform Revenue',
      badge: 'Retail Margin'
    },
    {
      title: 'Aggregated Anonymized Agricultural Data & Telemetry',
      desc: 'Mandi price prediction indices, yield forecasts, and regional pest outbreak maps licensed to crop insurance underwriters and commodities desks.',
      share: '4% of Platform Revenue',
      badge: 'Data Intelligence'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem' }}>Platform Monetization & Revenue Model</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sustainable multi-sided marketplace business architecture
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', fontSize: '1.2rem', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Live GMV Metric Row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Merchandise Value</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                ₹{(stats.total_gmv_inr || 876660).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#047857' }}>Net Platform Revenue (2%)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                ₹{(stats.platform_revenue_inr || 17533).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#eff6ff', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>Middleman Margin Saved</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                {stats.saved_farmer_middleman_cost_percentage || 28.5}%
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {revenueStreams.map((r, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '16px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{r.title}</h4>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#f1f5f9', color: '#059669', padding: '2px 8px', borderRadius: '4px' }}>
                  {r.share}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn-primary" onClick={onClose}>
            Close Revenue View
          </button>
        </div>
      </div>
    </div>
  );
}
