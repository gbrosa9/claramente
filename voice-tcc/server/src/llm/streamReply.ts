import { tccSystemPrompt } from './tccSystemPrompt'

export async function* streamReply(history?: any) {
  // placeholder dummy streamer: split a fixed sentence into chunks
  const text = 'Olá, eu sou sua assistente. Como você está se sentindo hoje?'
  const parts = text.match(/.{1,40}(?:\s|$)/g) || [text]
  for (const p of parts) {
    await new Promise((r) => setTimeout(r, 120))
    yield { text: p, tone: 'calmo' }
  }
}
