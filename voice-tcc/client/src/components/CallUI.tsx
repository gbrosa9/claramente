import React, { useEffect, useRef, useState } from 'react'
import { setupPeer, connectToSignaling } from '../rtc/peer'
import TtsPlayer from '../audio/ttsPlayer'

export default function CallUI() {
  const [state, setState] = useState<'IDLE'|'LISTENING'|'THINKING'|'SPEAKING'>('IDLE')
  const [level, setLevel] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    wsRef.current = connectToSignaling()
    wsRef.current.onopen = () => console.log('WS open')
    wsRef.current.onmessage = (ev) => {
      try {
        const d = JSON.parse(ev.data)
        if (d.type === 'tone') {
          // map tone to avatar expression
        }
        if (d.type === 'no_webrtc') {
          setState('SPEAKING')
        }
      } catch (e) {
        // binary audio chunk
        if (playerRef.current) playerRef.current.playChunk(new Uint8Array(ev.data))
      }
    }
    return () => { wsRef.current?.close() }
  }, [])

  const startCall = async () => {
    const { pc, localStream } = await setupPeer(wsRef.current!)
    const player = new TtsPlayer()
    player.onRMS((r: number) => setLevel(r))
    playerRef.current = player
    wsRef.current?.send(JSON.stringify({ type: 'join' }))
  }

  return (
    <div>
      <div>Estado: {state}</div>
      <div>Level: {Math.round(level * 100)}</div>
      <button onClick={startCall}>Iniciar</button>
    </div>
  )
}
