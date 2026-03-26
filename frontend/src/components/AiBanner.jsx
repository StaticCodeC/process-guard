export default function AiBanner({ onDismiss }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 16px',
      background: 'linear-gradient(90deg, #1a1f35 0%, #1e2538 100%)',
      borderBottom: '1px solid #2a2f45',
      flexShrink: 0,
      zIndex: 999,
    }}>
      <span style={{ color: '#8892b0', fontSize: 12 }}>
        <span style={{ color: '#a78bfa', fontWeight: 600 }}>🤖 AI</span>
        {'  ·  '}
        High availability predicted near Spring Garden Rd in 45 min
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          color: '#4a5568',
          fontSize: 16,
          lineHeight: 1,
          padding: '0 4px',
          marginLeft: 8,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
