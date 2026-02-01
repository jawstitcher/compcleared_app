import React from 'react';

const LegalWhitepaper = () => {
    return (
        <div style={{ fontFamily: '"Merriweather", serif', lineHeight: '1.6', color: '#334155', maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
            <div style={{ borderBottom: '4px solid #0f172a', paddingBottom: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>Security & Data Privacy Whitepaper</h1>
                <p style={{ fontStyle: 'italic', color: '#64748b' }}>Restricted Distribution • Last Updated October 2026</p>
            </div>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '15px' }}>1. Executive Summary</h2>
                <p>
                    CompCleared acknowledges the stringent requirements imposed by California Senate Bill 53 regarding the development and deployment of Frontier Artificial Intelligence Models.
                    This document outlines our technical safeguards, audit trails, and data sovereignty protocols designed to meet or exceed regulatory expectations.
                </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '15px' }}>2. SB 53 Compliance Architecture</h2>
                <p>
                    Our system implements a "Double-Lock" validation mechanism for all high-compute training runs.
                    Data ingress and egress are monitored via immutable logs stored on dedicated, air-gapped ledger nodes where applicable.
                </p>
                <div style={{ background: '#f1f5f9', padding: '20px', borderLeft: '4px solid #0f172a', marginTop: '20px' }}>
                    <strong>Privacy Note:</strong> No user-specific biometric or Personally Identifiable Information (PII) is used in the model training pipeline without explicit, signed consent forms (Form SB53-C).
                </div>
            </section>

            <div style={{ marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>Doc Ref: CC-WHITE-2026-A1</span>
                <span>Confidential & Proprietary</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => alert("Printing for Counsel Review...")}
                    style={{
                        background: 'transparent',
                        border: '1px solid #94a3b8',
                        padding: '8px 16px',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    Preview for Legal Counsel
                </button>
            </div>
        </div>
    );
};

export default LegalWhitepaper;
