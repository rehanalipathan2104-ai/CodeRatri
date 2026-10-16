import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConsumerMarketplace from './components/ConsumerMarketplace';
import FarmerDashboard from './components/FarmerDashboard';
import IndustryPortal from './components/IndustryPortal';
import AIDiseaseScanner from './components/AIDiseaseScanner';
import MSPTickerPanel from './components/MSPTickerPanel';
import KrishiBazaar from './components/KrishiBazaar';
import CartDrawer from './components/CartDrawer';
import OrderTrackingModal from './components/OrderTrackingModal';
import ProductDetailModal from './components/ProductDetailModal';
import VoiceAssistant from './components/VoiceAssistant';
import PlatformRoadmapModal from './components/PlatformRoadmapModal';
import RevenueAnalyticsModal from './components/RevenueAnalyticsModal';
import LoginPage from './components/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kisansetu_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr_patel',
        name: 'Rajesh Patel',
        phone: '+91 98765 43210',
        role: 'farmer',
        verified: true,
        farm_name: 'Shree Krishna Organic Farms',
        district: 'Anand',
        state: 'Gujarat'
      };
    } catch (e) {
      return null;
    }
  });
  const [currentRole, setCurrentRole] = useState(currentUser?.role || 'farmer'); // 'farmer', 'consumer', 'industry'
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'farmer', 'industry', 'disease', 'krishi-bazaar', 'msp', 'login'

  // Application Data States
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [mspRates, setMspRates] = useState([]);
  const [farmInputs, setFarmInputs] = useState([]);
  const [orders, setOrders] = useState([]);

  // Modals & Drawers
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Login & Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role) {
      setCurrentRole(user.role);
    }
    try {
      localStorage.setItem('kisansetu_user', JSON.stringify(user));
    } catch (e) {}
    showToast(`Welcome back, ${user.name}! Signed in as ${user.role?.toUpperCase() || 'USER'}`);
    if (user.role === 'farmer') setActiveTab('farmer');
    else if (user.role === 'industry') setActiveTab('industry');
    else setActiveTab('marketplace');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('kisansetu_user');
    } catch (e) {}
    showToast('Signed out of KisanSetu.');
    setActiveTab('marketplace');
  };

  // Show Toast Alert
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Data Fetch
  useEffect(() => {
    // 1. Fetch Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { if (data.success) setProducts(data.data); })
      .catch(() => {});

    // 2. Fetch Cart
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => { if (data.success) setCartItems(data.data); })
      .catch(() => {});

    // 3. Fetch Quotes
    fetch('/api/quotes')
      .then(res => res.json())
      .then(data => { if (data.success) setQuotes(data.data); })
      .catch(() => {});

    // 4. Fetch Contracts
    fetch('/api/contracts')
      .then(res => res.json())
      .then(data => { if (data.success) setContracts(data.data); })
      .catch(() => {});

    // 5. Fetch MSP Rates
    fetch('/api/msp')
      .then(res => res.json())
      .then(data => { if (data.success) setMspRates(data.data); })
      .catch(() => {});

    // 6. Fetch Krishi Bazaar Farm Inputs
    fetch('/api/marketplace')
      .then(res => res.json())
      .then(data => { if (data.success) setFarmInputs(data.data); })
      .catch(() => {});

    // 7. Fetch Orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (data.success) setOrders(data.data); })
      .catch(() => {});
  }, []);

  // Cart Operations
  const handleAddToCart = (product) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id, quantity: 1 })
    })
      .then(res => res.json())
      .then(() => {
        // Refresh Cart
        fetch('/api/cart')
          .then(res => res.json())
          .then(data => {
            if (data.success) setCartItems(data.data);
            showToast(`Added ${product.name} to harvest cart!`);
          });
      })
      .catch(() => {});
  };

  const handleUpdateCartQuantity = (cartItemId, newQty) => {
    fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty })
    })
      .then(() => {
        fetch('/api/cart')
          .then(res => res.json())
          .then(data => { if (data.success) setCartItems(data.data); });
      });
  };

  const handleRemoveCartItem = (cartItemId) => {
    fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' })
      .then(() => {
        fetch('/api/cart')
          .then(res => res.json())
          .then(data => { if (data.success) setCartItems(data.data); });
      });
  };

  const handleCheckoutComplete = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    showToast(`Order confirmed with tracking ${newOrder.id}!`);
  };

  // Farmer Add & Delete Product
  const handleAddProduct = (productData) => {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setProducts(prev => [json.data, ...prev]);
          showToast(`Successfully published ${json.data.name} to digital marketplace!`);
        }
      });
  };

  const handleDeleteProduct = (productId) => {
    fetch(`/api/products/${productId}`, { method: 'DELETE' })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast('Produce listing removed.');
      });
  };

  // Industry B2B RFQ
  const handleSubmitRfq = (rfqData) => {
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setQuotes(prev => [json.data, ...prev]);
          showToast(`Broadcasted RFQ for ${json.data.quantity_requested} quintals!`);
          setActiveTab('industry');
        }
      });
  };

  const handleUpdateQuote = (quoteId, status) => {
    fetch(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setQuotes(prev => prev.map(q => q.id === quoteId ? json.data : q));
          // Refresh contracts
          fetch('/api/contracts')
            .then(res => res.json())
            .then(data => { if (data.success) setContracts(data.data); });
          showToast('Quote accepted! Legally binding Digital Contract created with Escrow.');
        }
      });
  };

  // Review submission
  const handleAddReview = (reviewData) => {
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          showToast('Review submitted successfully!');
          // Refresh single product
          fetch(`/api/products/${reviewData.product_id}`)
            .then(r => r.json())
            .then(d => {
              if (d.success) {
                setSelectedProductDetail(d.data);
                setProducts(prev => prev.map(p => p.id === reviewData.product_id ? d.data : p));
              }
            });
        }
      });
  };

  // Quick purchase of Krishi Bazaar farm input
  const handleBuyFarmInput = (item) => {
    showToast(`Order placed for ${item.title} with free village delivery!`);
  };

  // Voice Command Dispatcher
  const handleVoiceCommandAction = (cmd) => {
    if (cmd.intent === 'SEARCH_PRODUCT') {
      setSearchQuery(cmd.entity);
      setActiveTab('marketplace');
      setCurrentRole('consumer');
      showToast(`Showing search results for "${cmd.entity}"`);
    } else if (cmd.intent === 'NAVIGATE_DISEASE_SCANNER') {
      setActiveTab('disease');
      showToast('Switched to AI Health & Disease Lab');
    } else if (cmd.intent === 'VIEW_MSP_RATES') {
      setActiveTab('msp');
      showToast('Displaying Government MSP Benchmarks');
    } else if (cmd.intent === 'SWITCH_ROLE') {
      setCurrentRole(cmd.role);
      setActiveTab(cmd.role === 'farmer' ? 'farmer' : cmd.role === 'industry' ? 'industry' : 'marketplace');
      showToast(`Switched portal to ${cmd.role.toUpperCase()}`);
    } else if (cmd.intent === 'NAVIGATE_KRISHI_BAZAAR') {
      setActiveTab('krishi-bazaar');
      showToast('Opened Krishi Bazaar inputs marketplace');
    } else if (cmd.intent === 'OPEN_CART') {
      setIsCartOpen(true);
    }
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 2000,
          background: 'rgba(15, 23, 42, 0.95)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span style={{ color: '#10b981' }}>✓</span> {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
      <Navbar 
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenRevenue={() => setIsRevenueOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        mspRates={mspRates}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'marketplace' && (
          <ConsumerMarketplace 
            products={products}
            onAddToCart={handleAddToCart}
            onOpenProductDetail={setSelectedProductDetail}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'farmer' && (
          <FarmerDashboard 
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onNavigateToDisease={() => setActiveTab('disease')}
            onNavigateToMsp={() => setActiveTab('msp')}
            orders={orders}
          />
        )}

        {activeTab === 'industry' && (
          <IndustryPortal 
            products={products}
            quotes={quotes}
            contracts={contracts}
            onSubmitRfq={handleSubmitRfq}
            onUpdateQuote={handleUpdateQuote}
          />
        )}

        {activeTab === 'disease' && (
          <AIDiseaseScanner 
            onBuyInputProduct={(prod) => {
              handleBuyFarmInput(prod);
              setActiveTab('krishi-bazaar');
            }}
          />
        )}

        {activeTab === 'krishi-bazaar' && (
          <KrishiBazaar 
            farmInputs={farmInputs}
            onBuyInput={handleBuyFarmInput}
          />
        )}

        {activeTab === 'msp' && (
          <MSPTickerPanel 
            mspRates={mspRates}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setActiveTab('marketplace')}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutComplete={handleCheckoutComplete}
        onOpenTracking={(ord) => setTrackingOrder(ord)}
      />

      {/* Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal 
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* Product Detail & Reviews Modal */}
      {selectedProductDetail && (
        <ProductDetailModal 
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
        />
      )}

      {/* Platform Roadmap Modal */}
      <PlatformRoadmapModal 
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      {/* Revenue Analytics Modal */}
      <RevenueAnalyticsModal 
        isOpen={isRevenueOpen}
        onClose={() => setIsRevenueOpen(false)}
      />

      {/* Floating Voice Assistant (KisanVaani) */}
      <VoiceAssistant 
        onVoiceCommandAction={handleVoiceCommandAction}
      />

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2500,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ maxWidth: '1050px', width: '100%' }}>
            <LoginPage 
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setIsLoginModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
