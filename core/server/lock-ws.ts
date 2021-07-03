import { Socket } from 'net'
import ws from 'ws'
import LibSync from '../utils/config/runtime-config/state'
import { logger, Logger } from '../utils/log-helper'

export class LockWebSocket {
  static wsServer: ws.Server
  static initTimestamp: number
  static logger: Logger
  static socket: ws
  static intervalId: NodeJS.Timeout

  static init(): void {
    LockWebSocket.logger = logger.child({ func: 'lock-ws' })

    LockWebSocket.wsServer = new ws.Server({
      noServer: true,
      path: '/ws/lock-status',
    })

    LockWebSocket.initTimestamp = Date.now()

    LockWebSocket.mountLogWebSockets()
  }

  static handleUpgrade(request: any, socket: Socket, head: any): void {
    LockWebSocket.wsServer.handleUpgrade(request, socket, head, (socket) => {
      LockWebSocket.wsServer.emit('connection', socket, request)
    })
  }

  private static mountLogWebSockets(): void {
    LockWebSocket.wsServer.on('connection', (socket) => {
      LockWebSocket.socket = socket

      LockWebSocket.socket.send(JSON.stringify({ isLocked: LibSync.isLocked }))

      LockWebSocket.streamLockStatus()
    })

    LibSync.lockStatus.on(this.sendLockstatus)
  }

  private static streamLockStatus(): void {
    if (LockWebSocket.intervalId) {
      clearInterval(LockWebSocket.intervalId)
    }

    LockWebSocket.intervalId = setInterval(() => {
      LockWebSocket.sendLockstatus()
    }, 3000)
  }

  private static sendLockstatus(): void {
    if (!!LockWebSocket.socket) {
      LockWebSocket.socket.send(JSON.stringify({ isLocked: LibSync.isLocked }))
    }
  }
}
