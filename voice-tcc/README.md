Voice-TCC — Ligação por voz com Avatar (Web + Node)

Resumão
- Stack: client (Vite + React + TypeScript + drei + three), server (Node + TypeScript + Express + ws), TTS: Piper local, LLM: OpenAI-compatible streaming.

Scripts
- pnpm -w i
- pnpm --filter server dev
- pnpm --filter client dev

Env
- SIGNALING_PORT=4000
- LLM_BASE_URL=http://localhost:1234
- LLM_API_KEY=
- PIPER_MODEL_PATH=/caminho/para/piper-model.onnx
- WHISPER_MODEL_PATH=/caminho/para/whisper-model.bin

Definition of Done
- TTS em streaming (não espera a frase inteira)
- Avatar sincroniza a boca com atraso perceptivo ≤ 150 ms
- Barge-in funciona
- Banner de recursos de crise visível

Troubleshooting
- Para problemas com wrtc use Node 18 (nvm) e instale cmake/ninja/python
- Se worklet não carregar, mova rmsWorklet.js para public/

