import React from 'react';
import '../App.css';

const SB53Dashboard = () => {
    // Colors: Deep Navy (#0f172a) and Slate Grey (#64748b)
    // Surface: 'Bureaucrat-Grade'

    // const [modalOpen, setModalOpen] = useState(false); // Valid for future expansion

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px' }}>
            {/* Header */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '40px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '700', margin: 0 }}>SB 53 Reporting Dashboard</h1>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
                    Frontier AI Safety & Compliance Framework • Regulatory Audit View
                </p>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {['Compute Threshold Status', 'Training Run Audits', 'Safety Protocol Verification'].map((title, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '24px', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>{title}</h3>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a' }}>
                            {idx === 0 ? 'Compliant' : idx === 1 ? '12 Verified' : 'Standard 2.1 Active'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Regulatory Liaison Contact Form */}
            <div style={{ maxWidth: '800px', margin: '40px auto 0', background: 'white', padding: '40px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <h2 style={{ color: '#0f172a', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Regulatory Liaison Contact</h2>

                <form>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Official Title</label>
                        <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #94a3b8', borderRadius: '4px' }} placeholder="e.g. Chief Compliance Officer" />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Inquiry Reference ID</label>
                        <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #94a3b8', borderRadius: '4px' }} placeholder="SB53-XXXX-YYYY" />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Message to Regulatory Body</label>
                        <textarea style={{ width: '100%', padding: '10px', border: '1px solid #94a3b8', borderRadius: '4px', minHeight: '120px' }}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="button" style={{
                            background: '#0f172a',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            fontWeight: '600',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Submit Liaison Request
                        </button>

                        <button type="button"
                            onClick={() => alert('Generative PDF Preview for Counsel... [Simulated]')}
                            style={{
                                background: 'white',
                                color: '#0f172a',
                                border: '1px solid #0f172a',
                                padding: '12px 24px',
                                fontWeight: '600',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                            Preview for Legal Counsel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SB53Dashboard;
