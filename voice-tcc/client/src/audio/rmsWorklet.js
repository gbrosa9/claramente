class RMSProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this._last = 0
  }
  process(inputs) {
    const input = inputs[0]
    if (!input || !input[0]) return true
    const samples = input[0]
    let sum = 0
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i]
    }
    const rms = Math.sqrt(sum / samples.length)
    this.port.postMessage({ rms })
    return true
  }
}

registerProcessor('rms-processor', RMSProcessor)
