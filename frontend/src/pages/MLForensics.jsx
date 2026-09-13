import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, AlertTriangle, CheckCircle, Info, ScanLine } from 'lucide-react';

export default function MLForensics() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setProgress(0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/api/ml-forensics', formData, {
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
        <h1 className="page-title">Machine Learning Forensics</h1>
        <p className="page-subtitle">Heuristics, OCR, and rules-based analysis.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Upload Document</h3>
          {!preview ? (
            <label className="file-upload-zone" style={{ display: 'block', marginTop: '16px' }}>
              <UploadCloud size={48} color="var(--text-secondary)" style={{ marginBottom: '16px' }} />
              <p>Click to browse or drag and drop a passport image</p>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ marginTop: '16px' }}>
              <img src={preview} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" onClick={handleUpload} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />} 
                  {loading ? 'Analyzing...' : 'Analyze Document'}
                </button>
                <button className="btn" onClick={() => { setFile(null); setPreview(null); setResult(null); }} style={{ background: 'var(--bg-card)' }} disabled={loading}>
                  Clear
                </button>
              </div>
              
              {loading && (
                <div style={{ marginTop: '16px', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>Processing Image...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-primary)', transition: 'width 0.3s ease' }}></div>
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
            <h3>Analysis Results</h3>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-primary)' }}>
                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="var(--success)"/> Status & Risk</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.risk_score > 50 ? 'var(--error)' : (result.risk_score > 30 ? 'var(--warning)' : 'var(--success)') }}>
                  {result.risk_score} / 100
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{result.risk_status}</div>
                
                {result.risk_reasons && result.risk_reasons.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <strong>Reasons:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                      {result.risk_reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-primary)' }}>
                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} color="var(--accent-primary)"/> Extracted Data</h4>
                <p><strong>MRZ:</strong> {result.mrz_text || 'None detected'}</p>
                <p><strong>Date of Birth:</strong> {result.dob}</p>
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-primary)' }}>
                <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><ScanLine size={18} color="var(--accent-secondary)"/> Forensic Metrics</h4>
                <p><strong>ELA Max Diff:</strong> {result.ela_max.toFixed(1)}</p>
                <p><strong>Copy-Move Score:</strong> {result.copy_move_score.toFixed(1)}</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
