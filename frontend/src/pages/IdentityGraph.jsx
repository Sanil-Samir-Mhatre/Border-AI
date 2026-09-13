import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Network, AlertTriangle, Loader2 } from 'lucide-react';

export default function IdentityGraph() {
  const [graphImg, setGraphImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/identity-graph`);
        setGraphImg(response.data.image);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><Network style={{ display: 'inline', marginRight: '10px' }}/> Identity Graph & Threat Intelligence</h1>
        <p className="page-subtitle">A detailed relationship graph linking biometrics (faces), documents, and travel records to detect synthetic identities and fraud rings.</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Knowledge Graph Visualization</h3>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Loader2 className="animate-spin" size={48} color="var(--text-secondary)" />
            </div>
          ) : error ? (
            <div style={{ color: 'var(--error)', marginTop: '16px' }}>Failed to load graph: {error}</div>
          ) : (
            <img src={graphImg} alt="Identity Graph" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
          )}
        </div>

        <div className="card">
          <h3>Intelligence Report</h3>
          
          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', marginBottom: '12px' }}>
              <AlertTriangle /> CRITICAL ALERT: Synthetic Identity Ring Detected
            </h4>
            <p><strong>Anomalies Found:</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><strong>Face-to-Multiple-Documents:</strong> `Face_Alpha` is strongly matched ({'>'}95% confidence) to both `Passport_US_123` and `Passport_UK_456`.</li>
              <li><strong>Shared Infrastructure:</strong> `Passport_US_123` and `Passport_CAN_789` both used the same contact number `Phone_555_0199` for travel bookings.</li>
              <li><strong>Coordinated Travel:</strong> Flights `BA101` and `EK202` were booked from the same IP address, linking the seemingly unrelated passengers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
