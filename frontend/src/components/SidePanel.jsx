const TYPE_CONFIG = {
  pay_station: { label: 'Pay Station', color: '#3b82f6' },
  accessible: { label: 'Accessible', color: '#22c55e' },
  park_ride: { label: 'Park & Ride', color: '#a855f7' },
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      color: color,
      background: bg,
      border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  )
}

function DetailRow({ label, value }) {
  if (!value || value === 'undefined' || value === 'nan' || value === '') return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2a2f45' }}>
      <span style={{ color: '#8892b0' }}>{label}</span>
      <span style={{ color: '#e8eaf6', fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function SidePanel({ spot, onClose }) {
  const tc = TYPE_CONFIG[spot.type] || { label: spot.type, color: '#8892b0' }
  const name = spot.name || spot.location || spot.street || 'Parking Spot'

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 320,
      height: '100%',
      background: '#141624',
      borderLeft: '1px solid #2a2f45',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 800,
      overflowY: 'auto',
      animation: 'slideIn 0.2s ease-out',
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(320px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #2a2f45' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e8eaf6', lineHeight: 1.3, flex: 1, marginRight: 8 }}>
            {name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#1e2130',
              color: '#8892b0',
              width: 28,
              height: 28,
              borderRadius: 6,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge color={tc.color} bg={`${tc.color}18`}>{tc.label}</Badge>
          {spot.available ? (
            <Badge color="#22c55e" bg="#22c55e18">Available</Badge>
          ) : (
            <Badge color="#ef4444" bg="#ef444418">Unavailable</Badge>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '4px 16px 12px' }}>
        {spot.type === 'pay_station' && (
          <>
            <DetailRow label="Zone" value={spot.zone} />
            <DetailRow label="Location" value={spot.location} />
          </>
        )}
        {spot.type === 'accessible' && (
          <>
            <DetailRow label="Street" value={spot.street} />
            <DetailRow label="From" value={spot.from_street} />
            <DetailRow label="To" value={spot.to_street} />
            <DetailRow label="Spots" value={spot.spots_count ? `${spot.spots_count} spot${spot.spots_count > 1 ? 's' : ''}` : null} />
            <DetailRow label="Time Limit" value={spot.time_limit} />
          </>
        )}
        {spot.type === 'park_ride' && (
          <>
            <DetailRow label="Capacity" value={spot.capacity ? `${spot.capacity} spaces` : null} />
            <DetailRow label="Monthly Cost" value={spot.cost} />
            <DetailRow label="Routes" value={spot.routes} />
          </>
        )}
        <div style={{ marginTop: 4, color: '#4a5568', fontSize: 11 }}>
          {spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}
        </div>
      </div>

      {/* Directions button */}
      <div style={{ padding: '0 16px 16px' }}>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            background: '#3b82f6',
            color: '#fff',
            borderRadius: 8,
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Get Directions →
        </a>
      </div>

      {/* Premium section */}
      <div style={{
        margin: '0 16px 16px',
        padding: 14,
        background: '#1e2130',
        border: '1px solid #2a2f45',
        borderRadius: 10,
        opacity: 0.7,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#4a5568', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Premium Insights
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #2a2f45' }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Predicted availability in 2h</span>
          <span style={{ color: '#6b7280', fontSize: 13 }}>High 🔒</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Safety score</span>
          <span style={{ color: '#6b7280', fontSize: 13 }}>8.2/10 🔒</span>
        </div>
        <button style={{
          marginTop: 10,
          width: '100%',
          padding: '8px',
          background: 'transparent',
          border: '1px solid #2a2f45',
          borderRadius: 6,
          color: '#6b7280',
          fontSize: 12,
          cursor: 'not-allowed',
        }} disabled>
          Unlock Premium →
        </button>
      </div>
    </div>
  )
}
