import React from 'react';
import { Info } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function About() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><Info style={{ display: 'inline', marginRight: '10px' }}/> About This Project</h1>
        <p className="page-subtitle">Architecture and journey behind Border-AI.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>User Journey</h3>
        <img src={`${API_BASE_URL}/static/User_Journey.png`} alt="User Journey" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>System Architecture</h3>
        <img src={`${API_BASE_URL}/static/Architecture_Flow.png`} alt="Architecture Flow" style={{ width: '100%', borderRadius: '8px', marginTop: '16px' }} />
      </div>

      <div className="card">
        <h3>The Journey</h3>
        <p style={{ marginTop: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          As a developer, building the Border-AI Screening System has been a journey of exploring how cutting-edge computer vision, deep learning, and graph analysis can solve critical real-world problems. The motivation stems from the growing sophistication of synthetic identity fraud and the need for robust, automated document forensics.
        </p>

        <h3 style={{ marginTop: '24px' }}>Purpose</h3>
        <p style={{ marginTop: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          The primary purpose of this application is to serve as an intelligent, automated first line of defense for border control and KYC (Know Your Customer) processes. It aims to detect subtle document manipulations and highlight complex fraud rings that might evade manual inspection.
        </p>

        <h3 style={{ marginTop: '24px' }}>Technical Description</h3>
        <p style={{ marginTop: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          This platform integrates multiple advanced AI components:
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
          <li><strong>OCR & MRZ Parsing:</strong> Uses EasyOCR and regex to extract visual text and Machine Readable Zones (MRZ).</li>
          <li><strong>Deep Learning Forensics (ResNet50):</strong> Utilizes a custom PyTorch model for high-accuracy forgery detection.</li>
          <li><strong>Error Level Analysis & Tamper Heatmaps:</strong> ELA and Grad-CAM for visual interpretability of model decisions.</li>
          <li><strong>Identity Graph:</strong> Uses `networkx` to map relationships across biometrics, documents, and travel records.</li>
        </ul>
        <p style={{ marginTop: '24px', fontWeight: 'bold' }}>Developed by Sanil</p>
      </div>
    </div>
  );
}
