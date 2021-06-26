import { Config } from '@/models/config'

// function http<T = unknown>(url: string) {
//   return fetch('http://192.168.1.4:3000' + url)
//     .then(res => res && res.json())
//     .then(json => json && (json as T))
//     .catch(console.error)
// }

export class ConfigService {
  static getConfig(): Promise<Config> {
    return fetch('http://192.168.1.4:3000/api/config')
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(json => {
        console.log(json)
        return json.config as Config
      })
  }

  static updateConfig(newConfig: Config): Promise<any> {
    return fetch('http://192.168.1.4:3000/api/config', {
      method: 'POST',
      body: JSON.stringify({ config: newConfig }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log(res)
      return res.json()
    })
  }
}
