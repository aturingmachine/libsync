import ws from 'ws'

function mountLogWebSockets(): ws.Server {
  const wsServer = new ws.Server({ noServer: true })

  console.log('Binding to Connection in WSS')
  wsServer.on('connection', (socket) => {
    console.log('Have WS Connection')
    socket.on('message', (message) => {
      console.log(message)
      socket.send(`Hi! You said ${message}`)
    })
  })

  return wsServer
}

export default mountLogWebSockets
