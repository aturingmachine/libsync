import ws from 'ws'
import fs from 'fs/promises'
import { debounce } from '../../utils/debounce'
import EnvConfig from '../../utils/config/env-config'
import { logger, Logger } from '../../utils/log-helper'
import WebSocket from 'ws'
import { Socket } from 'net'

const debouncedFileRead = async () => {
  debounce(async () => {
    return await fs.readFile(EnvConfig.get.combinedLogsOutputDir, {
      encoding: 'utf-8',
    })
  }, 1000)
}

// async function watchLogFile(): Promise<void> {}

async function watchLogFile(): Promise<void> {
  try {
    const logWatcher = fs.watch(EnvConfig.get.combinedLogsOutputDir)

    for await (const _event of logWatcher) {
    }
  } catch (error) {}
}

// function mountLogWebSockets(): ws.Server {
//   const wsServer = new ws.Server({ noServer: true })

//   console.log('Binding to Connection in WSS')
//   wsServer.on('connection', (socket) => {
//     console.log('Have WS Connection')
//     socket.on('message', (message) => {
//       console.log(message)
//       socket.send(`Hi! You said ${message}`)
//     })
//   })

//   return wsServer
// }

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
    console.log('Binding to Connection in WSS')
    this.wsServer.on('connection', (socket) => {
      console.log('Have WS Connection')
      this.socket = socket

      logger.stream({ start: 100 }).on('log', (newLog) => {
        this.socket.send(JSON.stringify(newLog))
      })

      this.socket.on('message', (message) => {
        console.log(message)
        this.socket.send(`Hi! You said ${message}`)
      })

      this.logger.info('Tailing File')
    })
  }

  handleUpgrade(request: any, socket: Socket, head: any) {
    this.wsServer.handleUpgrade(request, socket, head, (socket) => {
      this.wsServer.emit('connection', socket, request)
    })
  }
}

// export default mountLogWebSockets
