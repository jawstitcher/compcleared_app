import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

const FAQ = ({ items, compact = false }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div style={{
            maxWidth: compact ? '800px' : '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div
                        key={idx}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            style={{
                                width: '100%',
                                padding: '20px 24px',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontFamily: 'inherit',
                                fontSize: '17px',
                                fontWeight: '600',
                                color: '#0f172a'
                            }}
                            aria-expanded={isOpen}
                        >
                            <span>{item.q}</span>
                            <span style={{
                                fontSize: '24px',
                                color: '#64748B',
                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                marginLeft: '16px',
                                flexShrink: 0
                            }}>+</span>
                        </button>
                        {isOpen && (
                            <div style={{
                                padding: '0 24px 20px 24px',
                                color: '#475569',
                                lineHeight: '1.7',
                                fontSize: '15px'
                            }}>
                                {item.a}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FAQ;
