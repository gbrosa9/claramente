export default class TtsPlayer {
  ctx: AudioContext | null = null
  source: MediaStreamAudioSourceNode | null = null
  rmsCb: ((r: number) => void) | null = null

  async attachTrack(track: MediaStreamTrack) {
    this.ctx = new AudioContext()
    await this.ctx.audioWorklet.addModule('/src/audio/rmsWorklet.js')
    const ms = new MediaStream([track])
    this.source = this.ctx.createMediaStreamSource(ms)
    const node = new AudioWorkletNode(this.ctx, 'rms-processor')
    node.port.onmessage = (ev) => {
      const r = ev.data.rms
      // normalization & offset/gain
      const gain = 0.12
      const offset = 0.01
      const v = Math.max(0, Math.min(1, (r + offset) * (gain * 10)))
      if (this.rmsCb) this.rmsCb(v)
    }
    this.source.connect(node)
    node.connect(this.ctx.destination)
  }

  onRMS(cb: (r: number) => void) {
    this.rmsCb = cb
  }

  async playChunk(chunk: Uint8Array) {
    // fallback: decode PCM 16k mono and play via AudioContext
    if (!this.ctx) this.ctx = new AudioContext()
    const float32 = new Float32Array(chunk.length / 2)
    for (let i = 0; i < float32.length; i++) {
      const v = (chunk[i*2] | (chunk[i*2+1] << 8)) / 32768
      float32[i] = v
    }
    const buffer = this.ctx.createBuffer(1, float32.length, 16000)
    buffer.copyToChannel(float32, 0)
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.connect(this.ctx.destination)
    src.start()
  }
}
