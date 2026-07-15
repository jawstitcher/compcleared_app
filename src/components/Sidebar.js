import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, FileText, BarChart3, BookOpen, Lock, ShieldCheck, Users, LogOut } from 'lucide-react';
import Logo from './Logo';

const Sidebar = ({ children, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            section: 'Active',
            items: [
                { name: 'Workplace Violence Prevention Plan & Records', icon: ShieldCheck, path: '/dashboard', active: true, sub: ['Incident Log', 'Written Plan', 'Reports'] }
            ]
        },
        {
            section: 'Planned Features',
            items: [
                { name: 'OSHA 300 Log', icon: ClipboardList, path: null, locked: true, badge: 'Pro Upgrade' },
                { name: 'Employee Handbooks', icon: BookOpen, path: null, locked: true, badge: 'Pro Upgrade' }
            ]
        },
        {
            section: 'Records',
            items: [
                { name: 'Training Tracker', icon: Users, path: '/training', active: true }
            ]
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <aside style={{
                width: '280px',
                backgroundColor: '#fff',
                borderRight: '1px solid #e2e8f0',
                padding: '24px 0',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <Logo size="small" />
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                        Organize records. Stay prepared.
                    </p>
                </div>

                {navItems.map((group) => (
                    <div key={group.section} style={{ marginBottom: '20px' }}>
                        <p style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '0 20px',
                            marginBottom: '8px'
                        }}>
                            {group.section}
                        </p>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isLocked = item.locked;
                            const active = !isLocked && isActive(item.path);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => !isLocked && item.path && navigate(item.path)}
                                    disabled={isLocked}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        padding: '10px 20px',
                                        background: active ? '#f0fdf4' : 'transparent',
                                        border: 'none',
                                        borderLeft: active ? '3px solid #10B981' : '3px solid transparent',
                                        color: isLocked ? '#94a3b8' : (active ? '#065f46' : '#334155'),
                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: active ? '600' : '500',
                                        textAlign: 'left',
                                        gap: '12px',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    {isLocked ? (
                                        <Lock size={16} color="#94a3b8" />
                                    ) : (
                                        <Icon size={16} color={active ? '#10B981' : '#64748b'} />
                                    )}
                                    <span style={{ flex: 1 }}>{item.name}</span>
                                    {item.badge && (
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: '#fef3c7',
                                            color: '#92400e',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.3px'
                                        }}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}

                <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
                    <button
                        onClick={onLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
};

export default Sidebar;
