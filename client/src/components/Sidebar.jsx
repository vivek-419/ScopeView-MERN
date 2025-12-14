import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Sidebar.css'

function Sidebar() {
    const { user } = useAuth()

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return '👑'
            case 'engineer': return '🔧'
            case 'viewer': return '👀'
            default: return '👤'
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return '#ff6b6b'
            case 'engineer': return '#4c6ef5'
            case 'viewer': return '#51cf66'
            default: return '#868e96'
        }
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="sidebar-logo-icon">
                        <path d="M3 13h2l2-7 4 14 4-14 2 7h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h1 className="sidebar-logo">ScopeView</h1>
                </div>
                <p className="sidebar-subtitle">Telemetry Dashboard</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sidebar-icon">
                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="sidebar-label">Dashboard</span>
                </NavLink>

                <NavLink to="/historical" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sidebar-icon">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="sidebar-label">Historical Playback</span>
                </NavLink>

                {/* Only show Stream Configuration to engineers and admins */}
                {(user?.role === 'engineer' || user?.role === 'admin') && (
                    <NavLink to="/streams" className="sidebar-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sidebar-icon">
                            <path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="sidebar-label">Stream Configuration</span>
                    </NavLink>
                )}

                <NavLink to="/settings" className="sidebar-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sidebar-icon">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 1v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M1 12h3m14 0h3M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="sidebar-label">Settings</span>
                </NavLink>
            </nav>

            {user && (
                <div style={{
                    marginTop: 'auto',
                    padding: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: '#aaa',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {user.email}
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: `${getRoleColor(user.role)}22`,
                        border: `1px solid ${getRoleColor(user.role)}`,
                        fontSize: '11px',
                        fontWeight: '600',
                        color: getRoleColor(user.role),
                        textTransform: 'capitalize'
                    }}>
                        <span>{getRoleIcon(user.role)}</span>
                        <span>{user.role}</span>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar
