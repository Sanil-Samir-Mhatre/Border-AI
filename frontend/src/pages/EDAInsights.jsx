import React, { useState } from 'react';
import axios from 'axios';
import { BarChart2, Loader2, Play } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function EDAInsights() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRunEDA = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/eda`);
      setMessage(response.data.message || 'EDA completed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><BarChart2 style={{ display: 'inline', marginRight: '10px' }}/> Raw Dataset Inspection & EDA</h1>
        <p className="page-subtitle">Visualizations of the document dataset characteristics.</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button className="btn" onClick={handleRunEDA} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Play />} 
          {loading ? 'Running EDA...' : 'Run EDA Pipeline'}
        </button>
        {message && <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>{message}</span>}
      </div>

      <div className="grid-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card">
          <h3>Dataset Class Distribution</h3>
          <img src={`${API_BASE_URL}/static/EDA_Class_Distribution.png`} alt="Class Distribution" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
        </div>

        <div className="card">
          <h3>Feature Engineering & Extraction</h3>
          <img src={`${API_BASE_URL}/static/FeatureEngineering_Visuals.png`} alt="Feature Engineering" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
        </div>

        <div className="card">
          <h3>Preprocessing Enhancements</h3>
          <img src={`${API_BASE_URL}/static/Preprocessing_Before_After.png`} alt="Preprocessing" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
        </div>
      </div>
    </div>
  );
}
