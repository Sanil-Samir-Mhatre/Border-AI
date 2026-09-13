import React, { useState } from 'react';
import axios from 'axios';
import { Activity, Loader2, Play } from 'lucide-react';

export default function ModelEval() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRunTrain = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/train');
      setMessage(response.data.message || 'Training completed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { Model: 'Random Forest (Mark 1)', Accuracy: 0.90, Precision: 0.88, Recall: 0.91, F1: 0.89, ROC_AUC: 0.92 },
    { Model: 'ResNet50 (Mark 2)', Accuracy: 0.75, Precision: 0.76, Recall: 0.74, F1: 0.75, ROC_AUC: 0.78 }
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><Activity style={{ display: 'inline', marginRight: '10px' }}/> Model Evaluation & Baseline Comparison</h1>
        <p className="page-subtitle">Metrics for Model A (Classical ML), Model B (EfficientNet/ResNet), and Evidence Fusion.</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button className="btn" onClick={handleRunTrain} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Play />} 
          {loading ? 'Running Training Pipeline...' : 'Run Training Pipeline'}
        </button>
        {message && <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>{message}</span>}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Metrics Overview</h3>
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Model</th>
                <th style={{ padding: '12px' }}>Accuracy</th>
                <th style={{ padding: '12px' }}>Precision</th>
                <th style={{ padding: '12px' }}>Recall</th>
                <th style={{ padding: '12px' }}>F1 Score</th>
                <th style={{ padding: '12px' }}>ROC-AUC</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>{m.Model}</td>
                  <td style={{ padding: '12px' }}>{m.Accuracy}</td>
                  <td style={{ padding: '12px' }}>{m.Precision}</td>
                  <td style={{ padding: '12px' }}>{m.Recall}</td>
                  <td style={{ padding: '12px' }}>{m.F1}</td>
                  <td style={{ padding: '12px' }}>{m.ROC_AUC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h3>Mark 1: Random Forest CM</h3>
          <img src="http://localhost:8000/static/CM_Mark1_RandomForest.png" alt="CM Random Forest" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
        </div>
        <div className="card">
          <h3>Mark 2: ResNet50 CM</h3>
          <img src="http://localhost:8000/static/CM_Mark2_ResNet50.png" alt="CM ResNet50" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
        </div>
      </div>

      <div className="card">
        <h3>Deep Learning Training History</h3>
        <img src="http://localhost:8000/static/training_history.png" alt="Training History" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
      </div>
    </div>
  );
}
