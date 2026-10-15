import React from 'react';
import { 
  X, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Package, 
  ShieldCheck 
} from 'lucide-react';

export default function OrderTrackingModal({ order, onClose }) {
  if (!order) return null;

  const timeline = order.tracking_timeline || [
    { status: 'placed', title: 'Order Placed & Payment Verified', time: '14 Oct, 09:15 AM', completed: true },
    { status: 'confirmed', title: 'Farmer Rajesh Patel Confirmed & Harvested', time: '14 Oct, 01:30 PM', completed: true },
    { status: 'dispatched', title: 'Dispatched via Krishi Cold-Chain', time: '15 Oct, 06:45 AM', completed: true },
    { status: 'in_transit', title: 'In Transit: Reached Delhi North Hub', time: '15 Oct, 04:20 PM', completed: true },
    { status: 'delivered', title: 'Out for Delivery to Customer', time: 'Tomorrow by 11:30 AM', completed: false }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={24} color="#059669" />
              <h3 style={{ fontSize: '1.3rem' }}>Live Order Tracking</h3>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Order No: <strong>{order.id}</strong> • Tracking No: <strong>{order.tracking_number}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', fontSize: '1.2rem', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Status Pill Card */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>
              Estimated Arrival
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px' }}>
              {order.estimated_delivery || 'In 1-2 business days'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#d1fae5', marginTop: '4px' }}>
              Logistics: {order.delivery_partner || 'Krishi Cold-Chain Express'}
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#fcd34d'
          }}>
            ● IN TRANSIT (HUB-2)
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="timeline-stepper">
          {timeline.map((step, idx) => (
            <div 
              key={idx}
              className={`timeline-step ${step.completed ? 'completed' : ''}`}
            >
              <div className="timeline-icon-dot">
                {step.completed ? <CheckCircle size={14} /> : <Clock size={14} color="#94a3b8" />}
              </div>
              <div style={{ flex: 1, paddingBottom: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: step.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {step.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address & Contact */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
            <MapPin size={15} color="#059669" /> Delivery Destination:
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {order.delivery_address}
          </div>
        </div>

        <button 
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Close Tracking
        </button>
      </div>
    </div>
  );
}
