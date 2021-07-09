import express, { NextFunction } from 'express'
import path from 'path'
import { logger, Logger } from '../utils/log-helper.js'
import aboutApi from './rest-apis/about-api.js'
import configApi from './rest-apis/config-api.js'
import { LockWebSocket } from './websockets/lock-ws.js'
import mountLogsRouter from './rest-apis/logs-api.js'
import { LogWebSocket } from './websockets/logs-ws.js'
import { ProcessWebSocket } from './websockets/process-ws.js'
import { fileURLToPath } from 'url'
import snapshotApi from './rest-apis/snapshot-api.js'

let apiLogger: Logger

// TODO this can be cleaned up
function mountApi(): void {
  apiLogger = logger.child({ func: 'api-main' })
  const app = express()

  app.use(express.json())

  // TODO handle CORS in dev more gracefully lol
  app.use(function (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'X-requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization'
    )
    res.header('Access-Control-Max-Age', '10000')

    next()
  })

  app.get('/client', (req: express.Request, res: express.Response) => {
    res.sendFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../client/index.html'
      )
    )
  })

  // TODO this is very, very unsafe and should be fixed
  app.get(
    '/client/:dir/:resource',
    (req: express.Request, res: express.Response) => {
      res.sendFile(
        path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          `../client/${req.params.dir}/${req.params.resource}`
        )
      )
    }
  )

  app.use(mountLogsRouter())
  app.use(configApi)
  app.use(aboutApi)
  app.use(snapshotApi)
  apiLogger.info('REST Controllers mounted')

  const server = app.listen(3000)
  apiLogger.info('LibSync API Initialized')

  LogWebSocket.init()
  LockWebSocket.init()
  ProcessWebSocket.init()
  apiLogger.info('WebSockets Initialized')

  server.on('upgrade', (request, socket, head) => {
    const pathName: string = request.url

    if (pathName === '/ws/logs') {
      LogWebSocket.handleUpgrade(request, socket, head)
    }

    if (pathName === '/ws/lock-status') {
      LockWebSocket.handleUpgrade(request, socket, head)
    }

    if (pathName === '/ws/process-info') {
      ProcessWebSocket.handleUpgrade(request, socket, head)
    }
  })
}

export default mountApi
