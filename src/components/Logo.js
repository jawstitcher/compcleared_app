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



    const textStyle = {
        fontFamily: "'Inter', 'Poppins', sans-serif",
        fontSize: size === 'large' ? '28px' : size === 'small' ? '18px' : '22px',
        fontWeight: '800',
        letterSpacing: '-0.02em',
        display: 'flex'
    };

    return (
        <div style={containerStyle}>
            <img
                src="/logo192.png"
                alt="CompCleared Logo"
                style={{
                    width: size === 'large' ? '48px' : size === 'small' ? '24px' : '36px',
                    height: size === 'large' ? '48px' : size === 'small' ? '24px' : '36px',
                    borderRadius: '50%', // Optional, ensures if image has corners they are rounded, though the image itself is circular
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'block'
                }}
            />
            <div style={textStyle}>
                <span style={{ color: isDark ? 'white' : '#0f172a' }}>Comp</span>
                <span style={{ color: isDark ? '#38bdf8' : '#2563eb' }}>Cleared</span>
            </div>
        </div>
    );
};

export default Logo;
