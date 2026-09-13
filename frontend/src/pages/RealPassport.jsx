import React from 'react';
import { FileCheck } from 'lucide-react';

export default function RealPassport() { 
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><FileCheck style={{ display: 'inline', marginRight: '10px' }}/> Application on Real Passport</h1>
        <p className="page-subtitle">Review the real-world application and forensics of the system.</p>
      </div>
      <div className="card">
        <iframe 
          src={`${import.meta.env.VITE_API_URL}/static/real_passport_app.pdf`} 
          width="100%" 
          height="800px" 
          style={{ border: 'none', borderRadius: '8px' }}
          title="Real Passport PDF"
        />
      </div>
    </div>
  );
}
