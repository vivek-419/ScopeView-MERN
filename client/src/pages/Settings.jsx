import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import './Settings.css'

function Settings() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [emailData, setEmailData] = useState({
        email: user?.email || 'user@example.com',
        newEmail: ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleEmailUpdate = (e) => {
        e.preventDefault()
        alert('Email update functionality would be implemented here')
        setEmailData({ ...emailData, newEmail: '' })
    }

    const handlePasswordUpdate = (e) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match')
            return
        }

        alert('Password update functionality would be implemented here')
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="settings-page">
            <PageHeader
                title="Settings"
                subtitle="Manage your account and preferences"
            />

            <div className="settings-grid">
                {/* User Info */}
                <Card>
                    <h3 className="section-title">Account Info</h3>

                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user?.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Role:</span>
                        <span className="info-value role-badge">{user?.role}</span>
                    </div>
                </Card>

                {/* Email Settings */}
                <Card>
                    <h3 className="section-title">Email Settings</h3>

                    <form onSubmit={handleEmailUpdate}>
                        <div className="form-group">
                            <label className="form-label">Current Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={emailData.email}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter new email"
                                value={emailData.newEmail}
                                onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Update Email
                        </button>
                    </form>
                </Card>

                {/* Password Settings */}
                <Card>
                    <h3 className="section-title">Change Password</h3>

                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter current password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter new password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Update Password
                        </button>
                    </form>
                </Card>

                {/* Account Actions */}
                <Card>
                    <h3 className="section-title">Account</h3>

                    <button className="btn btn-danger logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </Card>
            </div>
        </div>
    )
}

export default Settings
