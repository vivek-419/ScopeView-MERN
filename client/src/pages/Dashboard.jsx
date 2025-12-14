import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { configAPI } from '../services/api'
import useSocket from '../hooks/useSocket'
import PageHeader from '../components/PageHeader'
import StatsCard from '../components/StatsCard'
import TelemetryChart from '../components/TelemetryChart'
import StreamSelector from '../components/StreamSelector'
import LogViewer from '../components/LogViewer'
import ExportCSVButton from '../components/ExportCSVButton'
import Card from '../components/Card'
import './Dashboard.css'

function Dashboard() {
    const { user } = useAuth()
    const { isConnected, subscribe, onTelemetry } = useSocket()

    // Load streams dynamically from API instead of hardcoding
    const [availableStreams, setAvailableStreams] = useState([])
    const [loadingStreams, setLoadingStreams] = useState(true)

    const [selectedStreams, setSelectedStreams] = useState([])
    const [telemetryData, setTelemetryData] = useState([])
    const [logs, setLogs] = useState([])
    const [stats, setStats] = useState({
        connected: false,
        activeStreams: 0,
        dataRate: 0,
        sessionName: 'session-' + Date.now()
    })

    // Load streams from API on mount
    useEffect(() => {
        const loadStreams = async () => {
            try {
                setLoadingStreams(true)
                const data = await configAPI.getAllStreams()
                // Map API data to the format expected by the dashboard
                const streamData = data.map(stream => ({
                    key: stream.streamKey,
                    name: stream.name,
                    color: stream.color || '#00aaff',
                    unit: stream.unit || ''
                }))
                setAvailableStreams(streamData)

                // Auto-select first 2 streams if available
                if (streamData.length > 0 && selectedStreams.length === 0) {
                    setSelectedStreams(streamData.slice(0, Math.min(2, streamData.length)).map(s => s.key))
                }
            } catch (error) {
                console.error('Failed to load streams:', error)
                // Fallback to hardcoded streams if API fails
                const fallbackStreams = [
                    { key: 'cpu_usage', name: 'CPU Usage', color: '#00aaff' },
                    { key: 'memory_usage', name: 'Memory Usage', color: '#ff4444' },
                ]
                setAvailableStreams(fallbackStreams)
                setSelectedStreams(['cpu_usage', 'memory_usage'])
            } finally {
                setLoadingStreams(false)
            }
        }
        loadStreams()
    }, []) // Only run once on mount

    // Subscribe to selected streams when they change
    useEffect(() => {
        if (isConnected && selectedStreams.length > 0) {
            const sessionId = stats.sessionName
            subscribe(sessionId, selectedStreams)
            console.log('📡 Subscribed to streams:', selectedStreams)
        }
    }, [selectedStreams, isConnected, subscribe, stats.sessionName])

    // Listen for telemetry updates
    useEffect(() => {
        const handleTelemetry = (data) => {
            console.log('📊 Received telemetry:', data)

            // Update chart data
            setTelemetryData(prev => {
                const timestamp = new Date(data.timestamp).getTime()
                const newPoint = {
                    timestamp,
                    [data.streamKey]: data.value
                }

                const updated = [...prev, newPoint]
                // Keep only last 50 points
                return updated.slice(-50)
            })

            // Add log entry
            const stream = availableStreams.find(s => s.key === data.streamKey)
            if (stream) {
                setLogs(prev => [...prev, {
                    timestamp: new Date(data.timestamp).toLocaleTimeString(),
                    stream: stream.name,
                    value: data.value.toFixed(2),
                    type: 'info'
                }].slice(-100)) // Keep last 100 logs
            }

            // Update stats
            setStats(prev => ({
                ...prev,
                dataRate: prev.dataRate + 1 // Increment counter
            }))
        }

        onTelemetry(handleTelemetry)

        // Cleanup on unmount
        return () => {
            // Socket cleanup handled by useSocket hook
        }
    }, [onTelemetry, availableStreams])

    // Update connection status
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            connected: isConnected,
            activeStreams: selectedStreams.length
        }))
    }, [isConnected, selectedStreams.length])

    // Calculate data rate per second
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                dataRate: 0 // Reset counter (will be incremented by incoming data)
            }))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const handleToggleStream = useCallback((streamKey) => {
        setSelectedStreams(prev => {
            if (prev.includes(streamKey)) {
                return prev.filter(key => key !== streamKey)
            } else {
                return [...prev, streamKey]
            }
        })
    }, [])

    const activeStreamObjects = availableStreams.filter(s => selectedStreams.includes(s.key))

    return (
        <div className="dashboard">
            <PageHeader
                title="Real-time Telemetry Dashboard"
                subtitle="Monitor your system metrics in real-time"
            />

            {/* Stats Cards Row */}
            <div className="dashboard-stats">
                <StatsCard
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    label="Connection Status"
                    value={stats.connected ? 'Connected' : 'Disconnected'}
                    status={stats.connected ? 'connected' : 'disconnected'}
                />
                <StatsCard
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 13h2l2-7 4 14 4-14 2 7h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                    label="Active Streams"
                    value={selectedStreams.length}
                    status="active"
                />
                <StatsCard
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                    label="Data Rate"
                    value={`${stats.dataRate} pts/sec`}
                />
                <StatsCard
                    icon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    label="Session"
                    value={stats.sessionName.substring(0, 15) + '...'}
                />
            </div>

            {/* Main Content Area */}
            <div className="dashboard-main">
                {/* Chart Section */}
                <div className="dashboard-chart-section">
                    {telemetryData.length === 0 && (
                        <Card className="empty-state">
                            <p>Waiting for telemetry data...</p>
                            <p className="empty-state-hint">
                                {isConnected ?
                                    'Data will appear here when telemetry is received' :
                                    'Connecting to server...'}
                            </p>
                        </Card>
                    )}
                    {telemetryData.length > 0 && (
                        <TelemetryChart
                            data={telemetryData}
                            streams={activeStreamObjects}
                        />
                    )}
                </div>

                {/* Control Panel */}
                <aside className="dashboard-controls">
                    <StreamSelector
                        streams={availableStreams}
                        selectedStreams={selectedStreams}
                        onToggleStream={handleToggleStream}
                    />

                    <Card className="control-panel">
                        <h3 className="control-title">Time Range</h3>
                        <div className="time-range-buttons">
                            <button className="time-btn">5m</button>
                            <button className="time-btn">15m</button>
                            <button className="time-btn active">1h</button>
                        </div>
                    </Card>

                    <Card className="control-panel">
                        <h3 className="control-title">Session</h3>
                        <select className="form-select compact">
                            <option>{stats.sessionName}</option>
                        </select>
                    </Card>

                    <ExportCSVButton
                        data={telemetryData}
                        filename="scopeview-telemetry"
                    />
                </aside>
            </div>

            {/* Log Panel - Separate section below main content */}
            <div className="dashboard-logs">
                <LogViewer logs={logs} />
            </div>
        </div>
    )
}

export default Dashboard
