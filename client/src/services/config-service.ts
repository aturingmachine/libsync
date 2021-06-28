import { EnvConfig, RunTimeConfig } from '@/models/config'

export class ConfigService {
  static getEnvConfig(): Promise<EnvConfig> {
    return fetch('http://localhost:3000/api/config/env')
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(json => {
        console.log(json)
        return json.config as EnvConfig
      })
  }

  static updateEnvConfig(newConfig: EnvConfig): Promise<EnvConfig> {
    return fetch('http://localhost:3000/api/config/env', {
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

  static getRuntimeConfig(): Promise<RunTimeConfig> {
    return fetch('http://localhost:3000/api/config/runtime')
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(json => {
        console.log(json)
        return json.config as RunTimeConfig
      })
  }

  static updateRuntimeConfig(newConfig: RunTimeConfig): Promise<RunTimeConfig> {
    return fetch('http://localhost:3000/api/config/env', {
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
