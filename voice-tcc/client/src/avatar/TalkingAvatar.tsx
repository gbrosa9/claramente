import React, { useState } from 'react'
import Avatar2D from './Avatar2D'

export default function TalkingAvatar({ tone }: { tone: string }) {
  const [mouth, setMouth] = useState(0)
  return (
    <div>
      <Avatar2D mouth={mouth} />
    </div>
  )
}
