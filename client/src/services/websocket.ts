class WebSocketClient {
  private uri!: string
  private websocket!: WebSocket
  private onMessageFuncs: Record<string, (ev: MessageEvent<any>) => any> = {}

  open = new Promise<WebSocket>(resolve => {
    resolve(this.websocket)
  })

  constructor(uri: string) {
    this.uri = uri
    this.websocket = new WebSocket(uri)

    this.websocket.onopen = (_ev: any) => {
      this.open.then(ws => ws)
    }
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.websocket.send(data)
  }

  addMessageHandler(
    key: string,
    handler: (ev: MessageEvent<any>) => any
  ): void {
    this.onMessageFuncs[key] = handler.bind(this)
    this.setMessageHandlers()
  }

  removeMessageHandler(key: string): void {
    delete this.onMessageFuncs[key]
    this.setMessageHandlers()
  }

  private setMessageHandlers(): void {
    this.websocket.onmessage = (ev: MessageEvent<any>) => {
      Object.values(this.onMessageFuncs).forEach(func => func(ev))
    }
  }
}

export class LogsWebSocketClient extends WebSocketClient {
  addLogStreamHandler(handler: (ev: MessageEvent<any>) => void): void {
    this.addMessageHandler('LogWebSocketStream', handler)
  }
}

export class LockWebSocketClient extends WebSocketClient {
  addStatusHandler(handler: (ev: MessageEvent<any>) => void): void {
    this.addMessageHandler('LockStatusWebSocketStream', handler)
  }
}

// TODO properly configure this
export const LogsWebSocket = new LogsWebSocketClient(
  'ws://localhost:3000/ws/logs'
)
export const LockWebSocket = new LockWebSocketClient(
  'ws://localhost:3000/ws/lock-status'
)
