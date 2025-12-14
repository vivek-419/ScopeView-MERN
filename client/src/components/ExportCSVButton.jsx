import './ExportCSVButton.css'

function ExportCSVButton({ data, filename = 'telemetry-data' }) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('No data to export')
            return
        }

        // Convert data to CSV
        const headers = Object.keys(data[0]).join(',')
        const rows = data.map(row => Object.values(row).join(','))
        const csv = [headers, ...rows].join('\n')

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}-${new Date().toISOString()}.csv`
        link.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <button className="export-csv-btn" onClick={handleExport}>
            <span className="export-icon">📊</span>
            <span>Export CSV</span>
        </button>
    )
}

export default ExportCSVButton
