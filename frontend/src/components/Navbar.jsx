const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pay_station', label: 'Pay Stations' },
  { key: 'accessible', label: 'Accessible ♿' },
  { key: 'park_ride', label: 'Park & Ride' },
]

export default function Navbar({ stats, filter, onFilterChange }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '52px',
      background: '#141624',
      borderBottom: '1px solid #2a2f45',
      flexShrink: 0,
      gap: 12,
      zIndex: 1000,
    }}>
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        <img src="/logo.png" alt="ZoPark" height={50} style={{ display: 'block', borderRadius: 8, background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.25)' }} />
      </div>

      {/* Stats */}
      <div style={{
        flex: 1,
        textAlign: 'center',
        color: '#8892b0',
        fontSize: 13,
        whiteSpace: 'nowrap',
      }}>
        {stats ? (
          <span>
            <span style={{ color: '#e8eaf6', fontWeight: 600 }}>{stats.total}</span>
            {' spots · '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>{stats.available}</span>
            {' available'}
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              background: filter === f.key ? '#3b82f6' : '#1e2130',
              color: filter === f.key ? '#fff' : '#8892b0',
              border: `1px solid ${filter === f.key ? '#3b82f6' : '#2a2f45'}`,
              fontWeight: filter === f.key ? 600 : 400,
              transition: 'all 0.15s',
              fontSize: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
