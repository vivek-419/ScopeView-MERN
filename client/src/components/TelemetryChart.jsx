import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './TelemetryChart.css'

function TelemetryChart({ data, streams }) {
    // Custom tooltip with dark theme
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <p className="tooltip-label">{new Date(label).toLocaleTimeString()}</p>
                    {payload.map((entry, index) => {
                        // Find stream config to get unit
                        const stream = streams.find(s => s.key === entry.dataKey)
                        return (
                            <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.value.toFixed(2)} {stream?.unit}
                            </p>
                        )
                    })}
                </div>
            )
        }
        return null
    }

    return (
        <div className="telemetry-chart">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                        dataKey="timestamp"
                        stroke="var(--text-muted)"
                        tick={{ fill: 'var(--text-muted)' }}
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        tick={{ fill: 'var(--text-muted)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ color: 'var(--text-primary)' }}
                        iconType="line"
                    />
                    {streams.map((stream) => (
                        <Line
                            key={stream.key}
                            type="monotone"
                            dataKey={stream.key}
                            stroke={stream.color}
                            strokeWidth={2}
                            dot={false}
                            name={`${stream.name}${stream.unit ? ` (${stream.unit})` : ''}`}
                            isAnimationActive={true}
                            animationDuration={300}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TelemetryChart
