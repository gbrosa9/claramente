import { useRef, useEffect } from 'react'

export default function useLipSync(onUpdate: (v: number) => void) {
  const prev = useRef(0)
  return (rms: number) => {
    const offset = 0.01
    const gain = 0.12
    const target = Math.max(0, Math.min(1, (rms + offset) * (gain * 10)))
    const next = prev.current + (target - prev.current) * 0.25
    prev.current = next
    onUpdate(next)
  }
}
