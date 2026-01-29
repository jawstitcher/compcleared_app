import React from 'react';

const Logo = ({ type = 'color', size = 'medium' }) => {
    const isDark = type === 'white';

    const containerStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'large' ? '12px' : '8px',
        textDecoration: 'none',
        userSelect: 'none'
    };

    const iconStyle = {
        width: size === 'large' ? '48px' : size === 'small' ? '24px' : '36px',
        height: size === 'large' ? '48px' : size === 'small' ? '24px' : '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0f172a 0%, #0891b2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexShrink: 0
    };

    const checkStyle = {
        color: 'white',
        fontSize: size === 'large' ? '24px' : size === 'small' ? '14px' : '18px',
        fontWeight: 'bold',
        marginTop: '-2px'
    };

    const textStyle = {
        fontFamily: "'Inter', 'Poppins', sans-serif",
        fontSize: size === 'large' ? '28px' : size === 'small' ? '18px' : '22px',
        fontWeight: '800',
        letterSpacing: '-0.02em',
        display: 'flex'
    };

    return (
        <div style={containerStyle}>
            <div style={iconStyle}>
                <span style={checkStyle}>✓</span>
            </div>
            <div style={textStyle}>
                <span style={{ color: isDark ? 'white' : '#0f172a' }}>Comp</span>
                <span style={{ color: isDark ? '#38bdf8' : '#0891b2' }}>Cleared</span>
            </div>
        </div>
    );
};

export default Logo;
