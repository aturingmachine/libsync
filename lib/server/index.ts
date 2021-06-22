import express from 'express'
import path from 'path'
import mountLogsRouter from './logs'
import { LogWebSocket } from './logs-ws'

function mountApi() {
  const app = express()

  app.use(express.json())

  app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })

  app.use(mountLogsRouter())

  const server = app.listen(3000)
  // const wsServer = mountLogWebSockets()

  console.log('Binding To Upgrade')
  server.on('upgrade', (request, socket, head) => {
    console.log('Incoming Upgrade')
    const LogWs = new LogWebSocket(request, socket, head)
    // wsServer.handleUpgrade(request, socket, head, (socket) => {
    //   console.log('Handling Upgrade')
    //   wsServer.emit('connection', socket, request)
    // })
  })
}

export default mountApi
