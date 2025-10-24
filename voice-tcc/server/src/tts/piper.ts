import { spawn } from 'child_process'
import { Readable } from 'stream'

const PIPER_MODEL_PATH = process.env.PIPER_MODEL_PATH || '/caminho/para/piper-model.onnx'
const PIPER_HTTP_URL = process.env.PIPER_HTTP_URL || ''

export async function* synthesizeStream(text: string, abortSignal: AbortSignal): AsyncIterable<Buffer> {
  if (PIPER_HTTP_URL) {
    // escolher implementação de fetch: global (Node18+) ou node-fetch
    let fetchFn: any
    if (typeof fetch !== 'undefined') {
      fetchFn = (globalThis as any).fetch.bind(globalThis)
    } else {
      const mod = await import('node-fetch')
      fetchFn = (mod as any).default
    }

    // conectar abort signals
    const controller = new AbortController()
    const signal = controller.signal
    const onAbort = () => controller.abort()
    try {
      abortSignal.addEventListener('abort', onAbort)

      const url = `${PIPER_HTTP_URL.replace(/\/$/, '')}/synthesize`
      const res = await fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: PIPER_MODEL_PATH }),
        signal
      })

      if (!res.ok) {
        const errText = await (res.text().catch(() => '<no body>'))
        throw new Error(`Piper HTTP synth failed: ${res.status} ${errText}`)
      }

      const body = (res as any).body
      if (!body) return

      for await (const chunk of body) {
        if (abortSignal.aborted) break
        yield Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      }
    } finally {
      try { abortSignal.removeEventListener('abort', onAbort) } catch (e) { /* ignore */ }
    }

    return
  }

  // Fallback: executar binário piper local
  const p = spawn('piper', ['--model', PIPER_MODEL_PATH, '--text', text, '--output_raw'])
  p.on('error', (err) => console.error('Piper spawn error', err))
  const stream = Readable.from(p.stdout)
  for await (const chunk of stream) {
    if (abortSignal.aborted) { try { p.kill() } catch (e) { /* ignore */ } ; break }
    yield Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
  }
}
