import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, user } = useAuth()

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check role if specified
    if (requiredRole) {
        const hasPermission = checkRolePermission(user?.role, requiredRole)
        if (!hasPermission) {
            return <Navigate to="/dashboard" replace />
        }
    }

    return children
}

// Helper function to check role hierarchy
function checkRolePermission(userRole, requiredRole) {
    // Admin has access to everything
    if (userRole === 'admin') return true

    // Engineer routes
    if (requiredRole === 'engineer') {
        return userRole === 'engineer' || userRole === 'admin'
    }

    // Exact match for other roles
    return userRole === requiredRole
}

export default ProtectedRoute
