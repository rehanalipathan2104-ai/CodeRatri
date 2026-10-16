import React, { useState, useRef } from 'react';
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
  ShoppingBag,
  FolderOpen,
  Image as ImageIcon,
  Check,
  FileText
} from 'lucide-react';

export default function AIDiseaseScanner({ onBuyInputProduct }) {
  const [scanType, setScanType] = useState('crop'); // 'crop' or 'cattle'
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Verified realistic preset farm sample cases
  const presetSamples = {
    crop: [
      {
        id: 's-c1',
        title: 'Tomato Early Blight & Fruit Rot',
        preview: '/samples/tomato_blight_sample.webp',
        label: 'Necrotic target-board lesions on foliage & fruit',
        details: 'Alternaria solani fungal infection'
      },
      {
        id: 's-c2',
        title: 'Wheat Yellow Stripe Rust',
        preview: '/samples/wheat_rust_sample.jpg',
        label: 'Linear bright yellow pustules along leaf veins',
        details: 'Puccinia striiformis fungal spores'
      }
    ],
    cattle: [
      {
        id: 's-k1',
        title: 'Dairy Cow Udder Inspection',
        preview: '/samples/cattle_mastitis_sample.jpg',
        label: 'Acute udder swelling, hardness & reduced milk yield',
        details: 'Bovine Mastitis bacterial screening'
      },
      {
        id: 's-k2',
        title: 'Cattle Skin Lesion (Lumpy Skin)',
        preview: '/samples/cattle_lumpy_skin_sample.jpg',
        label: 'Firm circular cutaneous nodules & lesions across skin',
        details: 'Capripoxvirus vector-borne infection'
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
        sample_name: sample ? sample.title : 'Field Image Upload'
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

  // Handle file chosen from folder via input or drag-and-drop
  const processUploadedFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const uploadedSample = {
        id: 'upload-' + Date.now(),
        title: file.name,
        preview: dataUrl,
        label: `${(file.size / 1024).toFixed(1)} KB • Uploaded from folder`,
        isCustomUpload: true,
        file
      };
      handleStartScan(uploadedSample);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  return (
    <div>
      {/* Hidden Native File Input to pick from system folders */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        accept="image/png, image/jpeg, image/jpg, image/webp" 
        style={{ display: 'none' }} 
      />

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
        {/* Left Column: Upload / Folder Picker / Presets */}
        <div className="glass-panel" style={{ background: 'white', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>
              {scanType === 'crop' ? 'Inspect Crop Foliage, Stem or Fruit' : 'Inspect Cattle Skin, Udder or Eyes'}
            </h3>
            <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              AI Vision Model v2.4
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Choose any photo from your local folder or select a field sample below to run instant neural analysis.
          </p>

          {/* Interactive Upload Zone with Folder Browse & Drag-and-Drop */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? '#059669' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? '#f0fdf4' : '#f8fafc',
              transition: 'all 0.2s ease',
              marginBottom: '24px',
              position: 'relative'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'}
            onMouseOut={e => { if (!isDragging) e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            {selectedSample && selectedSample.isCustomUpload ? (
              <div>
                <img 
                  src={selectedSample.preview} 
                  alt="Custom Upload Preview" 
                  style={{
                    maxHeight: '140px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  {selectedSample.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                  ✓ File loaded from folder • Click to choose a different photo
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: isDragging ? '#d1fae5' : '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)'
                }}>
                  <UploadCloud size={30} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Choose Photo from Computer / Folder
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Click to open file browser or drag & drop image here
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  <FolderOpen size={14} color="#059669" /> Browse Device Folders (JPG, PNG, WEBP)
                </div>
              </div>
            )}
          </div>

          {/* Preset Farm Reference Cases */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Or Test Verified Farm Samples:
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Instant Click & Scan
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
                    boxShadow: selectedSample?.id === sample.id ? '0 0 0 2px #059669, 0 4px 12px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img 
                    src={sample.preview} 
                    alt={sample.title} 
                    style={{ width: '100%', height: '110px', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{sample.title}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>{sample.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostic Report */}
        <div className="glass-panel" style={{ background: 'white', padding: '28px', minHeight: '480px' }}>
          {isScanning ? (
            <div style={{ textAlign: 'center', padding: '90px 20px' }}>
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
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>
                Analyzing Agricultural Pathology...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
                Computer vision deep neural network running visual lesion segmentation and pathogen matching.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '12px' }}>
                Cross-referencing 45,000+ ICAR & Veterinary clinical datasets
              </div>
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
                    Scan ID: {diagnosisResult.scan_id} • Target: {scanType === 'crop' ? '🌾 Crop Pathology' : '🐄 Livestock Veterinary'}
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

              {/* Scanned Image Preview in Report */}
              {selectedSample && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <img 
                    src={selectedSample.preview} 
                    alt="Analyzed Specimen" 
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                      Analyzed Specimen: {selectedSample.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedSample.label}
                    </div>
                  </div>
                </div>
              )}

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {diagnosisResult.remedy_product.image_url && (
                      <img 
                        src={diagnosisResult.remedy_product.image_url} 
                        alt="Remedy product"
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                        Recommended Remedy in Krishi Bazaar
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#064e3b' }}>
                        {diagnosisResult.remedy_product.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                        ₹{diagnosisResult.remedy_product.price} (Subsidized Farm Rate)
                      </div>
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
                Upload any crop or cattle photo from your device folders, or select a sample case on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
