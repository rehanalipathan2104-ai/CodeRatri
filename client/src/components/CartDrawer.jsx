import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Truck,
  ArrowRight,
  QrCode
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckoutComplete,
  onOpenTracking 
}) {
  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [address, setAddress] = useState('Flat 402, Green Meadows, Hauz Khas, New Delhi 110016');
  const [buyerName, setBuyerName] = useState('Priya Sharma');
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product ? item.product.price_per_unit : 0;
    return acc + (price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 500 ? 0 : 50;
  const platformFee = +(subtotal * 0.02).toFixed(2); // 2% platform fee
  const total = +(subtotal + deliveryFee + platformFee).toFixed(2);

  const handlePay = () => {
    setIsProcessing(true);

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_id: 'usr-consumer-1',
        buyer_name: buyerName,
        delivery_address: address,
        payment_method: paymentMethod,
        total_amount: total,
        items: cartItems.map(c => ({
          product_id: c.product_id,
          name: c.product ? c.product.name : 'Produce Item',
          quantity: c.quantity,
          unit: c.product ? c.product.unit : 'kg',
          unit_price: c.product ? c.product.price_per_unit : 0,
          subtotal: c.product ? (c.product.price_per_unit * c.quantity) : 0
        }))
      })
    })
      .then(res => res.json())
      .then(json => {
        setIsProcessing(false);
        if (json.success) {
          setLastCreatedOrder(json.data);
          setStep('success');

          // Trigger Confetti Celebration!
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // fallback
          }

          if (onCheckoutComplete) onCheckoutComplete(json.data);
        }
      })
      .catch(() => {
        setIsProcessing(false);
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: 'white',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#059669" />
            <h3 style={{ fontSize: '1.25rem' }}>
              {step === 'cart' ? 'Harvest Shopping Cart' : step === 'checkout' ? 'Express Checkout' : 'Order Placed!'}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', fontSize: '1.2rem', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Cart Items */}
        {step === 'cart' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '14px' }} />
                  <h4>Your harvest cart is empty</h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                    Browse fresh produce directly from farmers and add items.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cartItems.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px',
                        border: '1px solid #f1f5f9',
                        borderRadius: 'var(--radius-md)',
                        background: '#fafafa'
                      }}
                    >
                      <img 
                        src={item.product?.image_url} 
                        alt={item.product?.name} 
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.product?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                          ₹{item.product?.price_per_unit} / {item.product?.unit}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                          ₹{((item.product?.price_per_unit || 0) * item.quantity).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          style={{ color: '#ef4444', marginTop: '8px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Produce Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Krishi Cold-Chain Delivery:</span>
                  <span style={{ fontWeight: 600, color: deliveryFee === 0 ? '#059669' : 'inherit' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Platform Maintenance (2%):</span>
                  <span style={{ fontWeight: 600 }}>₹{platformFee}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                </div>

                <button 
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                  onClick={() => setStep('checkout')}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout & Payment Modal */}
        {step === 'checkout' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Recipient Full Name
              </label>
              <input 
                type="text"
                value={buyerName}
                onChange={e => setBuyerName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Farm-to-Door Delivery Address
              </label>
              <textarea 
                rows="2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>
                Select Payment Method
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* UPI Option */}
                <div 
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    border: `2px solid ${paymentMethod === 'UPI' ? '#059669' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'UPI' ? '#ecfdf5' : 'white'
                  }}
                >
                  <QrCode size={22} color="#059669" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Instant UPI (GPay / PhonePe / Paytm)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan simulated QR & verify in seconds</div>
                  </div>
                </div>

                {/* Card Option */}
                <div 
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  style={{
                    border: `2px solid ${paymentMethod === 'Credit/Debit Card' ? '#059669' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'Credit/Debit Card' ? '#ecfdf5' : 'white'
                  }}
                >
                  <CreditCard size={22} color="#059669" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay with 256-bit SSL</div>
                  </div>
                </div>

                {/* COD Option */}
                <div 
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  style={{
                    border: `2px solid ${paymentMethod === 'Cash on Delivery' ? '#059669' : '#e2e8f0'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'Cash on Delivery' ? '#ecfdf5' : 'white'
                  }}
                >
                  <Truck size={22} color="#059669" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay upon inspection at doorstep</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Final Payable:</span>
                <span style={{ color: 'var(--primary)' }}>₹{total}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setStep('cart')}
              >
                Back to Cart
              </button>
              <button 
                type="button" 
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Verifying Gateway...' : `Pay ₹${total}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && lastCreatedOrder && (
          <div style={{ flex: 1, padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={38} />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#064e3b', marginBottom: '8px' }}>
              Payment Verified!
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Order ID: <strong>{lastCreatedOrder.id}</strong>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '340px', marginBottom: '24px' }}>
              Farmer notified. Fresh harvest will be dispatched in temperature-controlled cold chain logistics.
            </p>

            <div style={{ width: '100%', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.82rem', marginBottom: '24px' }}>
              <div>Delivery Partner: <strong>{lastCreatedOrder.delivery_partner}</strong></div>
              <div style={{ marginTop: '4px' }}>Tracking No: <strong>{lastCreatedOrder.tracking_number}</strong></div>
              <div style={{ marginTop: '4px' }}>Estimated: <strong>{lastCreatedOrder.estimated_delivery}</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button 
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '12px' }}
                onClick={() => {
                  onClose();
                  if (onOpenTracking) onOpenTracking(lastCreatedOrder);
                }}
              >
                Track Live Order Timeline
              </button>
              <button 
                className="btn-secondary"
                style={{ justifyContent: 'center', padding: '10px' }}
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
