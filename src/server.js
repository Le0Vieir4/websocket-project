import express from 'express';
import 'dotenv/config'
import http from 'http';
import { matchesRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/websocket.js';

const app  = express()
const PORT = process.env.PORT || 8000
const HOST = process.env.HOST || "0.0.0.0"

const server = http.createServer(app)


app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world!')
})
app.use('/matches', matchesRouter)

const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ?  `http://localhost:${PORT}` : `wss://${HOST}:${PORT}`
  console.log(`Server is running on ${baseUrl}`)
  console.log(`WebSocket server is running on ${baseUrl.replace('http', 'ws')}/ws`)
})