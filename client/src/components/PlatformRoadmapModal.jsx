import React from 'react';
import { 
  X, 
  Map, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Layers, 
  Rocket, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export default function PlatformRoadmapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const phases = [
    {
      phase: 'Phase 1: Foundation MVP (Completed)',
      status: 'Live & Operational',
      badgeColor: '#10b981',
      items: [
        'Multi-role authentication & user profiles (Farmer, Consumer, Industry)',
        'Direct farm-to-fork produce catalog with search, organic verification, and quality grading',
        'Real-time harvest shopping cart & multi-step payment gateway simulation (UPI, Cards, Net Banking)',
        'Cold-chain logistics order tracking with milestone timeline',
        'Farmer listings management & inventory stock controls'
      ]
    },
    {
      phase: 'Phase 2: AI Intelligence & Multilingual Voice (Live)',
      status: 'Current Version',
      badgeColor: '#059669',
      items: [
        'KisanVaani voice assistant with Web Speech recognition & TTS feedback',
        'Crop leaf pathogen computer vision diagnostics with chemical and organic treatments',
        'Bovine & livestock disease detection (Mastitis, Lumpy Skin Disease)',
        'Government MSP integration with APMC mandi live price variance tracking and selling recommendations'
      ]
    },
    {
      phase: 'Phase 3: B2B Procurement & Krishi Bazaar (Live)',
      status: 'Current Version',
      badgeColor: '#0284c7',
      items: [
        'B2B Industry RFQ bidding & negotiation workflow for food processors & millers',
        'Automated legally binding digital procurement contracts with Aadhaar eSign verification',
        'GST-compliant invoicing and escrow payment protection',
        'Krishi Bazaar input marketplace for certified hybrid seeds, IFFCO nano urea, and solar irrigation systems'
      ]
    },
    {
      phase: 'Phase 4: Scale, FinTech & Agri-Logistics (Q4 2026)',
      status: 'Upcoming Scaling',
      badgeColor: '#f59e0b',
      items: [
        'Direct Kisan Credit Card (KCC) low-interest working capital loans & crop insurance claims',
        'IoT automated soil moisture & weather sensor telemetry integration',
        'Hyperlocal drone logistics for rapid bio-pesticide delivery to rural pin codes',
        'Global export certifications (APEDA & Codex Alimentarius compliance) for European and Gulf markets'
      ]
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Map size={26} color="#059669" />
            <div>
              <h3 style={{ fontSize: '1.35rem' }}>Implementation Roadmap</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                MVP → AI Diagnostics → B2B Marketplace → FinTech Scaling
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', fontSize: '1.2rem', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {phases.map((p, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                background: idx < 3 ? '#ffffff' : '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{p.phase}</h4>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: `${p.badgeColor}15`,
                  color: p.badgeColor
                }}>
                  {p.status}
                </span>
              </div>

              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button className="btn-primary" onClick={onClose}>
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
