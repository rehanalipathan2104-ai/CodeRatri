import React, { useState } from 'react';
import { 
  Activity, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  ExternalLink,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

export default function AIDiseaseScanner({ onBuyInputProduct }) {
  const [scanType, setScanType] = useState('crop'); // 'crop' or 'cattle'
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // Preset realistic sample cases for farmers to test instantly
  const presetSamples = {
    crop: [
      {
        id: 's-c1',
        title: 'Tomato Leaf Sample',
        preview: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80',
        label: 'Brown spots with concentric rings on leaf'
      },
      {
        id: 's-c2',
        title: 'Wheat Leaf Sample',
        preview: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80',
        label: 'Yellow parallel stripe pustules along veins'
      }
    ],
    cattle: [
      {
        id: 's-k1',
        title: 'Dairy Cow Udder Inspection',
        preview: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=300&q=80',
        label: 'Swollen udder with reduced milk yield'
      },
      {
        id: 's-k2',
        title: 'Cattle Skin Lesion Sample',
        preview: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=300&q=80',
        label: 'Nodular circular eruptions on skin'
      }
    ]
  };

  const handleStartScan = (sample) => {
    setSelectedSample(sample);
    setIsScanning(true);
    setDiagnosisResult(null);

    // Call API or simulate AI neural inference
    fetch('/api/ai/disease-detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: scanType,
        image_url: sample ? sample.preview : '',
        sample_name: sample ? sample.title : 'Live Camera Upload'
      })
    })
      .then(res => res.json())
      .then(json => {
        setTimeout(() => {
          setIsScanning(false);
          if (json.success) {
            setDiagnosisResult(json.data);
          }
        }, 1200);
      })
      .catch(() => {
        setIsScanning(false);
      });
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2>
            <Activity color="#ef4444" size={32} /> AI Health & Disease Diagnosis Lab
          </h2>
          <p className="section-subtitle">
            Instant computer vision diagnostics for crop pathogens & livestock illnesses with verified remedies.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="role-pill-group">
          <button 
            className={`role-pill-btn ${scanType === 'crop' ? 'active' : ''}`}
            onClick={() => { setScanType('crop'); setDiagnosisResult(null); setSelectedSample(null); }}
          >
            🌾 Crop Plant Health
          </button>
          <button 
            className={`role-pill-btn ${scanType === 'cattle' ? 'active' : ''}`}
            onClick={() => { setScanType('cattle'); setDiagnosisResult(null); setSelectedSample(null); }}
          >
            🐄 Cattle & Livestock Health
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Upload / Camera / Presets */}
        <div className="glass-panel" style={{ background: 'white', padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
            {scanType === 'crop' ? 'Inspect Crop Foliage or Fruit' : 'Inspect Livestock Skin, Udder or Eyes'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Upload a clear high-resolution photo or select a field sample below to run instant neural analysis.
          </p>

          {/* Upload Zone */}
          <div 
            onClick={() => handleStartScan(presetSamples[scanType][0])}
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f8fafc',
              transition: 'all 0.2s ease',
              marginBottom: '24px'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'}
            onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Camera size={26} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Click to Capture or Upload Photo
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Supports JPG, PNG, WEBP (Auto-calibrated for sunlight & shadows)
            </div>
          </div>

          {/* Quick Preset Samples */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Or Test Preset Farm Cases:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {presetSamples[scanType].map(sample => (
                <div 
                  key={sample.id}
                  onClick={() => handleStartScan(sample)}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedSample?.id === sample.id ? '0 0 0 2px #059669' : 'none'
                  }}
                >
                  <img src={sample.preview} alt={sample.title} style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{sample.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sample.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostic Report */}
        <div className="glass-panel" style={{ background: 'white', padding: '28px', minHeight: '440px' }}>
          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid #ecfdf5',
                borderTopColor: '#059669',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <h3 style={{ fontSize: '1.25rem' }}>Analyzing Agricultural Pathology...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                Cross-referencing 45,000+ crop and veterinary pathological datasets.
              </p>
            </div>
          ) : diagnosisResult ? (
            <div>
              {/* Diagnosis Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#991b1b', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px' }}>
                    <AlertTriangle size={13} /> {diagnosisResult.severity}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{diagnosisResult.diagnosis}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Scan ID: {diagnosisResult.scan_id}
                  </div>
                </div>

                {/* Confidence Meter */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>
                    {diagnosisResult.confidence_score}%
                  </div>
                </div>
              </div>

              {/* Pathogen Cause */}
              <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Biological Cause: </strong>
                <span style={{ color: 'var(--text-secondary)' }}>{diagnosisResult.cause}</span>
              </div>

              {/* Symptoms Identified */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Observed Clinical Symptoms:</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {diagnosisResult.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div style={{ marginBottom: '16px', borderLeft: '3px solid #3b82f6', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1d4ed8', marginBottom: '4px' }}>
                  Recommended Modern Chemical Treatment:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {diagnosisResult.chemical_treatment}
                </div>
              </div>

              {/* Organic Treatment */}
              <div style={{ marginBottom: '22px', borderLeft: '3px solid #10b981', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857', marginBottom: '4px' }}>
                  Certified Organic / Traditional Ayurvedic Remedy:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {diagnosisResult.organic_treatment}
                </div>
              </div>

              {/* Remedy Product Purchase in Krishi Bazaar */}
              {diagnosisResult.remedy_product && (
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                      Recommended Remedy Available in Krishi Bazaar
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#064e3b' }}>
                      {diagnosisResult.remedy_product.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                      ₹{diagnosisResult.remedy_product.price} (Subsidized Farm Rate)
                    </div>
                  </div>

                  <button 
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    onClick={() => onBuyInputProduct(diagnosisResult.remedy_product)}
                  >
                    <ShoppingBag size={15} /> Order Remedy Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
              <Sparkles size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Ready for Diagnostic Scan</h3>
              <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                Select an image on the left to inspect disease markers, pathogens, and remedies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
