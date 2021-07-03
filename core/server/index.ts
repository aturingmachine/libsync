import express, { NextFunction } from 'express'
import path from 'path'
import { logger, Logger } from '../utils/log-helper'
import aboutApi from './about-api'
import configApi from './config-api'
import { LockWebSocket } from './lock-ws'
import mountLogsRouter from './logs-api'
import { LogWebSocket } from './logs-ws'

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
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })

  // TODO this is very, very unsafe and should be fixed
  app.get(
    '/client/:dir/:resource',
    (req: express.Request, res: express.Response) => {
      res.sendFile(
        path.resolve(
          __dirname,
          `../client/${req.params.dir}/${req.params.resource}`
        )
      )
    }
  )

  app.use(mountLogsRouter())
  app.use(configApi)
  app.use(aboutApi)
  apiLogger.info('REST Controllers mounted')

  const server = app.listen(3000)
  apiLogger.info('LibSync API Initialized')

  LogWebSocket.init()
  LockWebSocket.init()
  apiLogger.info('WebSockets Initialized')

  server.on('upgrade', (request, socket, head) => {
    const pathName: string = request.url

    if (pathName === '/ws/logs') {
      LogWebSocket.handleUpgrade(request, socket, head)
    }

    if (pathName === '/ws/lock-status') {
      LockWebSocket.handleUpgrade(request, socket, head)
    }
  })
}

export default mountApi
