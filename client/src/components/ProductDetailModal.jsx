import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  MessageSquare, 
  Send,
  User
} from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, onAddReview }) {
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('Priya Sharma');

  if (!product) return null;

  const reviews = product.reviews || [];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    if (onAddReview) {
      onAddReview({
        product_id: product.id,
        user_name: reviewerName,
        rating: newRating,
        comment: newReviewText
      });
    }

    setNewReviewText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: '0', overflow: 'hidden' }}>
        {/* Modal Top Image */}
        <div style={{ position: 'relative', height: '240px', background: '#0f172a' }}>
          <img 
            src={product.image_url} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          {product.is_organic && (
            <span className="product-tag-organic" style={{ top: '16px', left: '16px' }}>
              <ShieldCheck size={14} /> Certified Organic
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {product.category}
              </span>
              <h3 style={{ fontSize: '1.45rem', marginTop: '4px' }}>{product.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <MapPin size={15} color="#059669" />
                <span>{product.farmer_name} • {product.location_district}, {product.location_state}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{product.price_per_unit}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Per {product.unit} (In Stock: {product.stock_quantity})
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Quick Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Harvest Date:</span>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.harvest_date || 'Recent'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Variety:</span>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.variety || 'Desi Native'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quality Grade:</span>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#059669' }}>{product.quality_grade || 'Grade A'}</div>
            </div>
          </div>

          {/* Add to Cart Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
            <button 
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              <Plus size={18} /> Add to Cart (₹{product.price_per_unit})
            </button>
          </div>

          {/* Reviews Section */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="#059669" /> Verified Buyer Reviews ({reviews.length})
            </h4>

            {/* List Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {reviews.map((r, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.user_name}</span>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.comment}</p>
                </div>
              ))}
            </div>

            {/* Submit New Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Leave a Verified Review:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={18} 
                      fill={star <= newRating ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Share feedback on freshness, aroma, packing..."
                  value={newReviewText}
                  onChange={e => setNewReviewText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Send size={15} /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
