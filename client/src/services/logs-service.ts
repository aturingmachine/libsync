import { Log } from '@/models/logs'

export class LogsService {
  static loadInitialLogs(): Promise<Log[]> {
    return fetch('http://localhost:3000/api/logs/all')
      .then(res => {
        return res.json()
      })
      .then(json => {
        return json.logs as Log[]
      })
  }
}
