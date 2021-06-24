import ws from 'ws'
import fs from 'fs/promises'
import { debounce } from '../../utils/debounce'
import EnvConfig from '../../utils/config/env-config'
import { logger, Logger } from '../../utils/log-helper'
import WebSocket from 'ws'
import { Socket } from 'net'

export class LogWebSocket {
  wsServer!: ws.Server
  initTimestamp!: number
  logger!: Logger
  socket!: ws

  constructor(request: any, socket: Socket, head: any) {
    this.logger = logger.child({ func: 'log-websocket' })

    this.wsServer = new ws.Server({ noServer: true })
    this.initTimestamp = Date.now()

    this.mountLogWebSockets()
    this.handleUpgrade(request, socket, head)

    setTimeout(() => {
      this.logger.info('Delayed Log')
    }, 2000)
  }

  mountLogWebSockets(): void {
    setInterval(() => {
      this.logger.info('Firing Test Log In Interval')
    }, 1500)
    console.log('Binding to Connection in WSS')
    this.wsServer.on('connection', (socket) => {
      console.log('Have WS Connection')
      this.socket = socket

      this.streamLogs()

      this.socket.on('message', (message) => {
        console.log(message)
        this.socket.send(`Hi! You said ${message}`)
      })

      this.logger.info('Tailing File')
    })
  }

  handleUpgrade(request: any, socket: Socket, head: any): void {
    this.wsServer.handleUpgrade(request, socket, head, (socket) => {
      this.wsServer.emit('connection', socket, request)
    })
  }

  private streamLogs(): void {
    const buffer: any[] = []

    logger.stream({ start: 1 }).on('log', (newLog) => {
      this.socket.send(JSON.stringify([newLog]))
    })

    // logger.stream({ start: 1 }).on('log', (newLog) => {
    //   if (buffer.length < 10) {
    //     buffer.push(newLog)
    //   } else {
    //     this.socket.send(JSON.stringify(buffer))
    //     buffer = []
    //   }
    // })
  }
}
