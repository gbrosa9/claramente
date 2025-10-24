export function connectToSignaling() {
  const ws = new WebSocket('ws://localhost:4000')
  ws.binaryType = 'arraybuffer'
  return ws
}

export async function setupPeer(ws: WebSocket) {
  const pc = new RTCPeerConnection()
  const localStream = new MediaStream()
  // no local tracks required; server will send TTS track
  pc.ontrack = (e) => {
    const [track] = e.streams[0].getAudioTracks()
    // connect to TtsPlayer in app via event or callback
    console.log('Received remote track', track)
  }
  ws.onmessage = async (ev) => {
    const data = JSON.parse(ev.data)
    if (data.type === 'offer') {
      await pc.setRemoteDescription(data.offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      ws.send(JSON.stringify({ type: 'answer', answer: pc.localDescription }))
    }
    if (data.type === 'ice' && data.candidate) {
      await pc.addIceCandidate(data.candidate)
    }
  }

  return { pc, localStream }
}
