import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import TelemetryChart from '../components/TelemetryChart'
import './HistoricalPlayback.css'

function HistoricalPlayback() {
    const [formData, setFormData] = useState({
        stream: 'cpu_usage',
        session: 'demo-session-1',
        startDate: '',
        endDate: ''
    })

    const [historicalData, setHistoricalData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const availableStreams = [
        { key: 'cpu_usage', name: 'CPU Usage', color: '#00aaff' },
        { key: 'memory_usage', name: 'Memory Usage', color: '#ff4444' },
        { key: 'network_in', name: 'Network In', color: '#44ff44' },
        { key: 'network_out', name: 'Network Out', color: '#ffaa00' },
        { key: 'disk_read', name: 'Disk Read', color: '#ff44ff' },
        { key: 'disk_write', name: 'Disk Write', color: '#44ffff' },
        { key: 'tire_temperature', name: 'Tire Temperature', color: '#ff8800' },
    ]

    const handleLoadData = () => {
        setIsLoading(true)

        // Simulate API call - generate mock historical data
        setTimeout(() => {
            const mockData = Array.from({ length: 20 }, (_, i) => {
                const timestamp = new Date(Date.now() - (20 - i) * 60000).getTime()
                return {
                    timestamp,
                    [formData.stream]: Math.random() * 100
                }
            })

            setHistoricalData(mockData)
            setIsLoading(false)
        }, 1000)
    }

    const selectedStream = availableStreams.find(s => s.key === formData.stream)

    return (
        <div className="historical-page">
            <PageHeader
                title="Historical Playback"
                subtitle="View and analyze past telemetry data"
            />

            <div className="historical-controls">
                <Card>
                    <h3 className="section-title">Data Selection</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Stream</label>
                            <select
                                className="form-select"
                                value={formData.stream}
                                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                            >
                                {availableStreams.map(stream => (
                                    <option key={stream.key} value={stream.key}>
                                        {stream.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Session</label>
                            <select
                                className="form-select"
                                value={formData.session}
                                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                            >
                                <option value="demo-session-1">Demo Session 1</option>
                                <option value="demo-session-2">Demo Session 2</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Time</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-primary load-btn"
                        onClick={handleLoadData}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load Data'}
                    </button>
                </Card>
            </div>

            {historicalData.length > 0 && (
                <div className="historical-chart">
                    <TelemetryChart
                        data={historicalData}
                        streams={selectedStream ? [selectedStream] : []}
                    />
                </div>
            )}

            {historicalData.length === 0 && !isLoading && (
                <Card className="empty-state">
                    <p>No data loaded. Select parameters and click "Load Data" to view historical telemetry.</p>
                </Card>
            )}
        </div>
    )
}

export default HistoricalPlayback
