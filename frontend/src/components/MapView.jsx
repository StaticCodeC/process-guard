import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// leaflet.heat must be loaded after leaflet
import 'leaflet.heat'

const HALIFAX_CENTER = [44.6488, -63.5752]
const ZOOM = 13

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function spotColor(spot) {
  if (!spot.available) return '#6b7280'
  switch (spot.type) {
    case 'pay_station': return '#3b82f6'
    case 'accessible': return '#22c55e'
    case 'park_ride': return '#a855f7'
    default: return '#8892b0'
  }
}

function makeCircleMarker(spot) {
  const color = spotColor(spot)
  const radius = spot.type === 'park_ride' ? 10 : 7
  return L.circleMarker([spot.lat, spot.lng], {
    radius,
    fillColor: color,
    color: spot.available ? '#fff' : '#374151',
    weight: 1.5,
    fillOpacity: 0.85,
    opacity: 0.9,
  })
}

export default function MapView({ spots, heatmapData, showHeatmap, onToggleHeatmap, onSelectSpot, selectedSpot }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const heatLayerRef = useRef(null)

  // Init map once
  useEffect(() => {
    if (mapRef.current) return
    const map = L.map(containerRef.current, {
      center: HALIFAX_CENTER,
      zoom: ZOOM,
      zoomControl: true,
    })
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map)
    markersLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers when spots or selectedSpot changes
  useEffect(() => {
    const layer = markersLayerRef.current
    if (!layer) return
    layer.clearLayers()
    spots.forEach(spot => {
      const marker = makeCircleMarker(spot)
      marker.on('click', () => onSelectSpot(spot))
      if (selectedSpot && selectedSpot.id === spot.id) {
        marker.setStyle({ weight: 3, color: '#fff', radius: marker.options.radius + 2 })
      }
      marker.bindTooltip(
        spot.name || spot.location || spot.street || 'Parking',
        { direction: 'top', offset: [0, -8], className: 'zopark-tooltip' }
      )
      layer.addLayer(marker)
    })
  }, [spots, selectedSpot, onSelectSpot])

  // Heatmap layer
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (showHeatmap && heatmapData.length > 0) {
      const points = heatmapData.map(p => [p.lat, p.lng, p.intensity || 1])
      const heat = L.heatLayer(points, {
        radius: 25,
        blur: 20,
        maxZoom: 17,
        gradient: { 0.2: '#3b82f6', 0.5: '#f59e0b', 0.8: '#ef4444' },
      })
      heat.addTo(map)
      heatLayerRef.current = heat
    }
  }, [showHeatmap, heatmapData])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        .zopark-tooltip {
          background: #1e2130;
          border: 1px solid #2a2f45;
          color: #e8eaf6;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .zopark-tooltip::before { display: none; }
      `}</style>

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 12,
        zIndex: 700,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <button
          onClick={onToggleHeatmap}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            background: showHeatmap ? '#f59e0b' : '#1e2130',
            color: showHeatmap ? '#000' : '#e8eaf6',
            border: `1px solid ${showHeatmap ? '#f59e0b' : '#2a2f45'}`,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          🔥 Density Heatmap
        </button>

        <div style={{
          padding: '10px 12px',
          background: 'rgba(20, 22, 36, 0.92)',
          border: '1px solid #2a2f45',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}>
          {[
            { color: '#3b82f6', label: 'Pay Station' },
            { color: '#22c55e', label: 'Accessible' },
            { color: '#a855f7', label: 'Park & Ride' },
            { color: '#6b7280', label: 'Unavailable' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: color, display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ color: '#8892b0', fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
