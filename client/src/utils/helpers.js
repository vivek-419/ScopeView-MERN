// Format date/time helpers
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

// CSV Export helper
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Build CSV string
  const csvRows = [
    headers.join(','), // header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      }).join(',')
    )
  ]
  
  const csvString = csvRows.join('\n')
  
  // Create blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Color generation for streams
const colorPalette = [
  '#00aaff', '#ff4444', '#44ff44', '#ffaa00', 
  '#ff44ff', '#44ffff', '#ff8844', '#8844ff',
  '#44ff88', '#ffff44'
]

export const generateStreamColor = (index) => {
  return colorPalette[index % colorPalette.length]
}

// Data formatting
export const formatValue = (value, decimals = 2) => {
  if (typeof value === 'number') {
    return value.toFixed(decimals)
  }
  return value
}

// Local storage helpers
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

// Debounce helper
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
