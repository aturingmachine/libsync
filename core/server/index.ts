import express, { NextFunction } from 'express'
import path from 'path'
import { nextTick } from 'process'
import EnvConfig from '../utils/config/env-config/env-config'
import configApi from './config-api'
import { LockWebSocket } from './lock-ws'
import mountLogsRouter from './logs-api'
import { LogWebSocket } from './logs-ws'

// TODO this can be cleaned up
function mountApi(): void {
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

  const server = app.listen(3000)

  LogWebSocket.init()
  LockWebSocket.init()

  server.on('upgrade', (request, socket, head) => {
    const pathName: string = request.url

    if (pathName === '/ws/logs') {
      console.log('Got WS Upgrade for Logs')
      LogWebSocket.handleUpgrade(request, socket, head)
    }

    if (pathName === '/ws/lock-status') {
      console.log('Upgrade Lock')
      LockWebSocket.handleUpgrade(request, socket, head)
    }
  })

  EnvConfig.listen(['srcDir']).call((param, newSrcDir) => {
    console.log('Update Listener Pinged At', param, newSrcDir)
    return Promise.resolve()
  })
}

export default mountApi
