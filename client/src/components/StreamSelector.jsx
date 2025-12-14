import { useState } from 'react'
import './StreamSelector.css'

function StreamSelector({ streams, selectedStreams, onToggleStream }) {
    return (
        <div className="stream-selector">
            <h3 className="selector-title">Active Streams</h3>
            <div className="stream-list">
                {streams.map((stream) => (
                    <label key={stream.key} className="stream-item">
                        <input
                            type="checkbox"
                            checked={selectedStreams.includes(stream.key)}
                            onChange={() => onToggleStream(stream.key)}
                            className="stream-checkbox"
                        />
                        <span
                            className="stream-indicator"
                            style={{ backgroundColor: stream.color }}
                        />
                        <span className="stream-name">{stream.name}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default StreamSelector
