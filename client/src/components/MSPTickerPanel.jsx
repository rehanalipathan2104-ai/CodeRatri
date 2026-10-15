import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  HelpCircle, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function MSPTickerPanel({ mspRates = [] }) {
  const [selectedCommodity, setSelectedCommodity] = useState(mspRates[0] || null);

  const activeItem = selectedCommodity || mspRates[0];

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2>
            <TrendingUp color="#10b981" size={32} /> Government MSP & Mandi Price Intelligence
          </h2>
          <p className="section-subtitle">
            Official Ministry of Agriculture Minimum Support Price (MSP) benchmarks synced with live APMC Mandi feeds.
          </p>
        </div>

        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          color: '#065f46',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={16} color="#059669" /> Official APMC Mandi Live Feed
        </div>
      </div>

      {/* Main Grid: Table & Detailed Recommendation Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Table of Commodities */}
        <div className="glass-panel" style={{ background: 'white', padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Agricultural Commodities Benchmark</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 14px' }}>Commodity</th>
                  <th style={{ padding: '12px 14px' }}>Govt MSP</th>
                  <th style={{ padding: '12px 14px' }}>APMC Mandi</th>
                  <th style={{ padding: '12px 14px' }}>Variance</th>
                  <th style={{ padding: '12px 14px' }}>State Focus</th>
                </tr>
              </thead>
              <tbody>
                {mspRates.map((item, idx) => {
                  const isSelected = activeItem?.commodity === item.commodity;
                  const diff = item.mandi_avg_price - item.msp_price;
                  const percent = ((diff / item.msp_price) * 100).toFixed(1);

                  return (
                    <tr 
                      key={idx}
                      onClick={() => setSelectedCommodity(item)}
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: isSelected ? '#f0fdf4' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {item.commodity}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                        ₹{item.msp_price}/qtl
                      </td>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{item.mandi_avg_price}/qtl
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: diff >= 0 ? '#059669' : '#dc2626'
                        }}>
                          {diff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {diff >= 0 ? `+${percent}%` : `${percent}%`}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {item.state}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Price Recommendation Card */}
        {activeItem && (
          <div className="glass-panel" style={{ background: 'white', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                Commodity Intelligence
              </span>
              <span style={{
                background: '#ecfdf5',
                color: '#047857',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Live APMC Feed
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{activeItem.commodity}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Primary Hub: <strong>{activeItem.state}</strong>
            </div>

            {/* Price Cards Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Govt MSP Benchmark</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '4px' }}>
                  ₹{activeItem.msp_price}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Guaranteed procurement base</div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.78rem', color: '#047857' }}>Market Mandi Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  ₹{activeItem.mandi_avg_price}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                  Current Open Market
                </div>
              </div>
            </div>

            {/* Historical Month Trend Bars */}
            {activeItem.historical && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart3 size={16} /> 5-Month Mandi Movement (₹/Quintal)
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '110px', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                  {activeItem.historical.map((h, i) => {
                    const maxVal = Math.max(...activeItem.historical.map(x => x.price));
                    const heightPercent = (h.price / maxVal) * 85;
                    return (
                      <div key={i} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                          ₹{h.price}
                        </span>
                        <div style={{
                          width: '100%',
                          height: `${heightPercent}%`,
                          background: i === activeItem.historical.length - 1 ? '#059669' : '#a7f3d0',
                          borderRadius: '4px 4px 0 0'
                        }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          {h.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Recommendation Alert */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              gap: '12px'
            }}>
              <Sparkles size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e', marginBottom: '2px' }}>
                  AI Selling Strategy & Advisory:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.4 }}>
                  {activeItem.recommendation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
