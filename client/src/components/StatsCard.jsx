import Card from './Card'
import './StatsCard.css'

function StatsCard({ icon, label, value, status }) {
    return (
        <Card className="stats-card" hover={false}>
            <div className="stats-header">
                <span className="stats-label">{label}</span>
                <div className="stats-icon-wrapper">{icon}</div>
            </div>
            <div className="stats-value-wrapper">
                <div className="stats-value">{value}</div>
                {status && (
                    <div className={`stats-status stats-status-${status}`}>
                        <span className="status-dot"></span>
                        {status}
                    </div>
                )}
            </div>
        </Card>
    )
}

export default StatsCard
