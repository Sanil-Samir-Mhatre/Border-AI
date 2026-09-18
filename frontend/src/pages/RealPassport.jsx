import React from 'react';
import { FileCheck, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../config';

const REAL_PASSPORT_DRIVE_URL = 'https://drive.google.com/file/d/1S0ZGXtexAsdoXQaYTAm_6zgOFDwtNB-N/view?usp=drive_link';

export default function RealPassport() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><FileCheck style={{ display: 'inline', marginRight: '10px' }}/> Application on Real Passport</h1>
        <p className="page-subtitle">Review the real-world application and forensics of the system.</p>
      </div>
      <div className="card">
        <iframe
          src={`${API_BASE_URL}/static/real_passport_app.pdf`}
          width="100%"
          height="800px"
          style={{ border: 'none', borderRadius: '8px' }}
          title="Real Passport PDF"
        />
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p>The PDF preview is unavailable? Open the application report from Google Drive:</p>
          <p>
            <a
              href={REAL_PASSPORT_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {REAL_PASSPORT_DRIVE_URL}
            </a>
          </p>
          <a
            href={REAL_PASSPORT_DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            <ExternalLink size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            View application on a real passport
          </a>
        </div>
      </div>
    </div>
  );
}
