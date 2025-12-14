import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-icon">404</div>
                <h1 className="not-found-title">Page Not Found</h1>
                <p className="not-found-message">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/dashboard" className="btn btn-primary">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default NotFound
