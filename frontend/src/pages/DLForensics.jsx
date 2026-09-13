import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DLForensics() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 8; // Slower for DL
      });
    }, 1000);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/dl-forensics`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(progressInterval);
      setProgress(100);
      setResult(response.data);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Deep Learning Forensics</h1>
        <p className="page-subtitle">CNN-based forgery detection with visual interpretability.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Upload Document</h3>
          {!preview ? (
            <label className="file-upload-zone" style={{ display: 'block', marginTop: '16px' }}>
              <UploadCloud size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
              <p>Upload Identity Document</p>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ marginTop: '16px' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" onClick={handleUpload} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />} 
                  {loading ? 'Analyzing...' : 'Run DL Model'}
                </button>
                <button className="btn" onClick={() => { setFile(null); setPreview(null); setResult(null); }} style={{ background: 'var(--bg-card)' }} disabled={loading}>
                  Clear
                </button>
              </div>

              {loading && (
                <div style={{ marginTop: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>Running Deep Learning Pipeline...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-primary)', transition: 'width 1s ease' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
          {error && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '8px', display: 'flex', gap: '8px' }}>
              <AlertTriangle /> {error}
            </div>
          )}
        </div>

        {result && (
          <div className="card animate-fade-in">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="var(--accent-primary)" /> Risk Analysis
            </h3>
            <div style={{ marginTop: '24px', fontSize: '32px', fontWeight: 'bold', color: result.score > 50 ? 'var(--error)' : 'var(--success)' }}>
              {result.score} / 100 - {result.risk_level}
            </div>
            
            <div style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
              <strong>Reasons:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="animate-fade-in" style={{ marginTop: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>🔍 Forensic Analysis Maps</h2>
          <div className="grid-3">
            <div className="card">
              <h4>Preprocessed (Enhanced)</h4>
              <img src={`data:image/jpeg;base64,${result.preprocessed_img}`} alt="Enhanced" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />
            </div>
            <div className="card">
              <h4>Error Level Analysis (ELA)</h4>
              <img src={`data:image/jpeg;base64,${result.ela_map}`} alt="ELA" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />
            </div>
            <div className="card">
              <h4>Tamper Heatmap (Grad-CAM)</h4>
              <img src={`data:image/jpeg;base64,${result.gradcam_img}`} alt="Grad-CAM" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
