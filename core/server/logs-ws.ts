import ws from 'ws'
import fs from 'fs/promises'
import { debounce } from '../utils/debounce'
import EnvConfig from '../utils/config/env-config'
import { logger, Logger } from '../utils/log-helper'
import WebSocket from 'ws'
import { Socket } from 'net'

export class LogWebSocket {
  wsServer!: ws.Server
  initTimestamp!: number
  logger!: Logger
  socket!: ws

  constructor(request: any, socket: Socket, head: any) {
    this.logger = logger.child({ func: 'log-ws' })

    this.wsServer = new ws.Server({ noServer: true })
    this.initTimestamp = Date.now()

    this.mountLogWebSockets()
    this.handleUpgrade(request, socket, head)

    setInterval(() => {
      logger.info('Forever Log')
    }, 6000)
  }

  mountLogWebSockets(): void {
    this.wsServer.on('connection', (socket) => {
      this.socket = socket

      this.streamLogs()

      this.socket.on('message', (message) => {
        console.log(message)
        this.socket.send(`Hi! You said ${message}`)
      })
    })
  }

  handleUpgrade(request: any, socket: Socket, head: any): void {
    this.wsServer.handleUpgrade(request, socket, head, (socket) => {
      this.wsServer.emit('connection', socket, request)
    })
  }

  private streamLogs(): void {
    const buffer: any[] = []
    const hasDoneInitialSend = false

    logger.stream({ start: 1 }).on('log', (newLog) => {
      this.socket.send(JSON.stringify([newLog]))
    })
  }
}
