import ws from 'ws'
import { Socket } from 'net'
import { IncomingMessage } from 'http'
import { logger, Logger } from '../../utils/log-helper.js'

export class LogWebSocket {
  static wsServer: ws.Server
  static initTimestamp: number
  static logger: Logger
  static socket: ws

  static init(): void {
    LogWebSocket.logger = logger.child({ func: 'log-ws' })

    LogWebSocket.wsServer = new ws.Server({ noServer: true })
    LogWebSocket.initTimestamp = Date.now()

    LogWebSocket.mountLogWebSockets()
  }

  static handleUpgrade(request: any, socket: Socket, head: any): void {
    LogWebSocket.wsServer.handleUpgrade(request, socket, head, (socket) => {
      LogWebSocket.wsServer.emit('connection', socket, request)
    })
  }

  private static mountLogWebSockets(): void {
    LogWebSocket.wsServer.on('connection', LogWebSocket.onConnection)

    LogWebSocket.wsServer.on('close', () => {
      LogWebSocket.closeLogStream()
    })
  }

  private static onConnection(socket: ws, request: IncomingMessage): void {
    LogWebSocket.socket = socket

    LogWebSocket.streamLogs()
  }

  private static streamLogs(): void {
    logger.stream({ start: 20 }).on('log', LogWebSocket.sendLog)
  }

  private static closeLogStream(): void {
    logger.stream({ start: 20 }).off('log', LogWebSocket.sendLog)
  }

  private static sendLog(newLog: any): void {
    LogWebSocket.socket.send(JSON.stringify([newLog]))
  }
}
