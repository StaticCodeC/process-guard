import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import AiBanner from './components/AiBanner.jsx'
import MapView from './components/MapView.jsx'
import SidePanel from './components/SidePanel.jsx'

const API = 'http://localhost:8000'

export default function App() {
  const [stats, setStats] = useState(null)
  const [spots, setSpots] = useState([])
  const [heatmapData, setHeatmapData] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [aiBannerVisible, setAiBannerVisible] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(`${API}/api/parking?type=${filter}`)
      .then(r => r.json())
      .then(setSpots)
      .catch(() => {})
  }, [filter])

  useEffect(() => {
    fetch(`${API}/api/heatmap`)
      .then(r => r.json())
      .then(setHeatmapData)
      .catch(() => {})
  }, [])

  const handleSelectSpot = useCallback((spot) => {
    setSelectedSpot(spot)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedSpot(null)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <Navbar
        stats={stats}
        filter={filter}
        onFilterChange={setFilter}
      />
      {aiBannerVisible && (
        <AiBanner onDismiss={() => setAiBannerVisible(false)} />
      )}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapView
          spots={spots}
          heatmapData={heatmapData}
          showHeatmap={showHeatmap}
          onToggleHeatmap={() => setShowHeatmap(h => !h)}
          onSelectSpot={handleSelectSpot}
          selectedSpot={selectedSpot}
        />
        {selectedSpot && (
          <SidePanel spot={selectedSpot} onClose={handleClosePanel} />
        )}
      </div>
    </div>
  )
}
