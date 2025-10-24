'use client'

import { useState } from 'react'

export default function TestComponent() {
  const [showRealtimeVoice, setShowRealtimeVoice] = useState(false)

  if (showRealtimeVoice) {
    return (
      <div>Realtime Voice</div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div>Test Content</div>
    </div>
  )
}
