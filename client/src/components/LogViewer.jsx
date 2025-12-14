import { useState, useEffect, useRef } from 'react'
import './LogViewer.css'

function LogViewer({ logs, maxLogs = 100 }) {
    const [isOpen, setIsOpen] = useState(true)
    const logContainerRef = useRef(null)

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (logContainerRef.current && isOpen) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
        }
    }, [logs, isOpen])

    return (
        <div className={`log-viewer ${isOpen ? 'log-viewer-open' : ''}`}>
            <div className="log-header">
                <h3 className="log-title">System Logs</h3>
                <button
                    className="log-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '▼ Hide Logs' : '▲ Show Logs'}
                </button>
            </div>

            {isOpen && (
                <div className="log-content" ref={logContainerRef}>
                    {logs.length === 0 ? (
                        <div className="log-empty">No logs to display</div>
                    ) : (
                        logs.slice(-maxLogs).map((log, index) => (
                            <div key={index} className={`log-entry log-${log.type || 'info'}`}>
                                <span className="log-timestamp">[{log.timestamp}]</span>
                                <span className="log-stream">{log.stream}</span>
                                <span className="log-arrow">→</span>
                                <span className="log-value">{log.value}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default LogViewer
