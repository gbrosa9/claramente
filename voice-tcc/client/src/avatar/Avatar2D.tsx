import React from 'react'

export default function Avatar2D({ mouth }: { mouth: number }) {
  const open = mouth * 20
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-label="Avatar 2D">
      <circle cx="60" cy="60" r="50" fill="#eee" stroke="#ccc" />
      <rect x="40" y="70" width="40" height={10 + open} rx="5" fill="#b33" />
    </svg>
  )
}
