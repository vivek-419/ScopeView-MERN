import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { configAPI } from '../services/api'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import './StreamConfiguration.css'

function StreamConfiguration() {
    const { user } = useAuth()
    const [streams, setStreams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        streamKey: '',
        color: '#00aaff',
        color: '#00aaff',
        minValue: 0,
        maxValue: 100,
        unit: '',
        isVisible: true
    })
    const [editingId, setEditingId] = useState(null)

    // Load streams on mount
    useEffect(() => {
        loadStreams()
    }, [])

    const loadStreams = async () => {
        try {
            setLoading(true)
            const data = await configAPI.getAllStreams()
            setStreams(data)
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load streams')
            console.error('Error loading streams:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            if (editingId) {
                // Update existing stream
                await configAPI.updateStream(editingId, formData)
            } else {
                // Create new stream
                await configAPI.createStream(formData)
            }

            // Reset form and reload
            setFormData({
                name: '',
                streamKey: '',
                color: '#00aaff',
                minValue: 0,
                maxValue: 100,
                unit: '',
                isVisible: true
            })
            setEditingId(null)
            loadStreams()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save stream')
            console.error('Error saving stream:', err)
        }
    }

    const handleEdit = (stream) => {
        setFormData({
            name: stream.name,
            streamKey: stream.streamKey,
            color: stream.color,
            minValue: stream.minValue,
            maxValue: stream.maxValue,
            unit: stream.unit || '',
            isVisible: stream.isVisible
        })
        setEditingId(stream._id)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stream?')) {
            return
        }

        try {
            await configAPI.deleteStream(id)
            loadStreams()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete stream')
            console.error('Error deleting stream:', err)
        }
    }

    const handleCancelEdit = () => {
        setFormData({
            name: '',
            streamKey: '',
            color: '#00aaff',
            minValue: 0,
            maxValue: 100,
            unit: '',
            isVisible: true
        })
        setEditingId(null)
    }

    const canEdit = user?.role === 'engineer' || user?.role === 'admin'
    const canDelete = user?.role === 'engineer' || user?.role === 'admin' // Allow engineers to delete too

    return (
        <div className="stream-config-page">
            <PageHeader
                title="Stream Configuration"
                subtitle="Manage telemetry stream definitions"
            />

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            <div className="stream-config-layout">
                {/* Add/Edit Form */}
                {canEdit && (
                    <Card>
                        <h3 className="section-title">
                            {editingId ? 'Edit Stream' : 'Add New Stream'}
                        </h3>

                        <form onSubmit={handleSubmit} className="stream-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Stream Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., CPU Usage"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Stream Key *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., cpu_usage"
                                        value={formData.streamKey}
                                        onChange={(e) => setFormData({ ...formData, streamKey: e.target.value })}
                                        required
                                        disabled={!!editingId} // Can't change key when editing
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Min Value</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.minValue}
                                        onChange={(e) => setFormData({ ...formData, minValue: parseFloat(e.target.value) })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Max Value</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.maxValue}
                                        onChange={(e) => setFormData({ ...formData, maxValue: parseFloat(e.target.value) })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Unit</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        list="unit-options"
                                        placeholder="e.g. %"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                    <datalist id="unit-options">
                                        <option value="%" />
                                        <option value="MB/s" />
                                        <option value="Mbps" />
                                        <option value="°C" />
                                        <option value="°F" />
                                        <option value="V" />
                                        <option value="A" />
                                        <option value="W" />
                                        <option value="RPM" />
                                    </datalist>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Color</label>
                                    <input
                                        type="color"
                                        className="form-input color-input"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    />
                                </div>
                            </div>


                            <div className="form-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVisible}
                                        onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                    />
                                    <span>Visible by default</span>
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update Stream' : 'Create Stream'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </Card>
                )}

                {/* Stream List */}
                <Card>
                    <h3 className="section-title">Configured Streams</h3>

                    {loading && <p className="loading-text">Loading streams...</p>}

                    {!loading && streams.length === 0 && (
                        <p className="empty-text">No streams configured yet. {canEdit && 'Add one above to get started.'}</p>
                    )}

                    {!loading && streams.length > 0 && (
                        <div className="stream-list">
                            {streams.map((stream) => (
                                <div key={stream._id} className="stream-item">
                                    <div className="stream-info">
                                        <div
                                            className="stream-color-indicator"
                                            style={{ backgroundColor: stream.color }}
                                        />
                                        <div className="stream-details">
                                            <h4 className="stream-name">{stream.name}</h4>
                                            <p className="stream-key">{stream.streamKey}</p>
                                            <p className="stream-range">
                                                Range: {stream.minValue} - {stream.maxValue} {stream.unit}
                                            </p>
                                        </div>
                                    </div>

                                    {canEdit && (
                                        <div className="stream-actions">
                                            <button
                                                className="btn btn-small btn-secondary"
                                                onClick={() => handleEdit(stream)}
                                            >
                                                Edit
                                            </button>
                                            {canDelete && (
                                                <button
                                                    className="btn btn-small btn-danger"
                                                    onClick={() => handleDelete(stream._id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div >
    )
}

export default StreamConfiguration
