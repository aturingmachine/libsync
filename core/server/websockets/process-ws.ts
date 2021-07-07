import { IncomingMessage } from 'http'
import { Socket } from 'net'
import ws from 'ws'
import pidusage from 'pidusage'
import { logger, Logger } from '../../utils/log-helper.js'

export class ProcessWebSocket {
  static wsServer: ws.Server
  static initTimestamp: number
  static logger: Logger
  static socket: ws
  static interval: NodeJS.Timeout

  static init(): void {
    ProcessWebSocket.logger = logger.child({ func: 'process-ws' })

    ProcessWebSocket.wsServer = new ws.Server({ noServer: true })
    ProcessWebSocket.initTimestamp = Date.now()

    ProcessWebSocket.mountProcessWebSockets()
  }

  static handleUpgrade(request: any, socket: Socket, head: any): void {
    ProcessWebSocket.wsServer.handleUpgrade(request, socket, head, (socket) => {
      ProcessWebSocket.wsServer.emit('connection', socket, request)
    })
  }

  private static mountProcessWebSockets(): void {
    ProcessWebSocket.wsServer.on('connection', ProcessWebSocket.onConnection)

    ProcessWebSocket.wsServer.on('close', () => {
      ProcessWebSocket.clearInterval()
    })
  }

  private static onConnection(socket: ws, request: IncomingMessage): void {
    ProcessWebSocket.socket = socket

    ProcessWebSocket.clearInterval()
    ProcessWebSocket.streamProcessInfo()
  }

  private static streamProcessInfo(): void {
    ProcessWebSocket.logger.info('Streaming Process Information')
    ProcessWebSocket.interval = setInterval(async () => {
      const info = await pidusage(process.pid)
      ProcessWebSocket.sendInfo(info)
    }, 1000)
  }

  private static clearInterval(): void {
    ProcessWebSocket.logger.info('Clearing Interval')
    clearInterval(ProcessWebSocket.interval)
  }

  private static sendInfo(info: pidusage.Status): void {
    ProcessWebSocket.socket.send(JSON.stringify(info))
  }
}
