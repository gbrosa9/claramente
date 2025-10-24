import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import { handleWsConnection } from './webrtc'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  handleWsConnection(ws as any)
})

app.get('/health', (req, res) => res.send('ok'))
app.get('/', (req, res) => res.send('voice-tcc server'))

const port = process.env.SIGNALING_PORT || 4000
server.listen(port, () => console.log('listening on', port))
