import { Log } from '@/models/logs'

export class LogsService {
  static loadInitialLogs(): Promise<Log[]> {
    return fetch('http://192.168.1.4:3000/api/logs/all')
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(json => {
        console.log(json)
        return json.logs as Log[]
      })
  }
}
