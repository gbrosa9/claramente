import { WebSocket } from 'ws'
import { streamReply } from './llm/streamReply'
import { synthesizeStream } from './tts/piper'
import { TurnManager } from './turntaking'

let WRtc: any = null
let wrtcAvailable = false
try {
  WRtc = require('wrtc')
  wrtcAvailable = !!WRtc
} catch (err: any) {
  console.warn('wrtc not available, falling back to WS audio. Error:', err?.message || err)
}

const turnManager = new TurnManager()

export function handleWsConnection(ws: WebSocket) {
  let pc: any = null
  let audioTrack: any = null
  let abortController: AbortController | null = null

  ws.on('message', async (msg: string) => {
    let data: any
    try { data = JSON.parse(msg as string) } catch (e) { return }

    if (data.type === 'join') {
      if (wrtcAvailable) {
        pc = new WRtc.RTCPeerConnection()
        pc.onicecandidate = (e: any) => { if (e.candidate) ws.send(JSON.stringify({ type: 'ice', candidate: e.candidate })) }
        try {
          audioTrack = new WRtc.MediaStreamTrack({ kind: 'audio' }) as any
          pc.addTrack(audioTrack)
        } catch (err: any) {
          console.warn('wrtc present but MediaStreamTrack not available - will fallback to WS audio:', err?.message || err)
          audioTrack = null
        }

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        ws.send(JSON.stringify({ type: 'offer', offer: pc.localDescription }))
      } else {
        ws.send(JSON.stringify({ type: 'no_webrtc' }))
      }

      abortController = new AbortController()
      runPipeline(audioTrack, abortController.signal, ws)
    }
    if (data.type === 'answer' && pc) await pc.setRemoteDescription(data.answer)
    if (data.type === 'ice' && pc) await pc.addIceCandidate(data.candidate)
    if (data.type === 'barge_in') { abortController?.abort(); turnManager.setState('LISTENING'); ws.send(JSON.stringify({ type: 'barge_ack' })) }
  })
}

async function runPipeline(track: any, signal: AbortSignal, ws: WebSocket) {
  turnManager.setState('THINKING')
  const llmStream = streamReply(/* history placeholder */)
  for await (const chunk of llmStream) {
    if (signal.aborted) break
    ws.send(JSON.stringify({ type: 'tone', tone: chunk.tone }))
    const ttsStream = synthesizeStream(chunk.text, signal)
    for await (const audioChunk of ttsStream) {
      if (signal.aborted) break
      try {
        if (track && typeof (track as any).write === 'function') {
          (track as any).write(audioChunk)
        } else {
          ws.send(audioChunk)
        }
      } catch (e) { try { ws.send(audioChunk) } catch (_) {} }
    }
  }
  turnManager.setState('IDLE')
}
