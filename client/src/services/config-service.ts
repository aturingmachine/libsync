import { EnvConfig, RuntimeConfig } from '@/models/config'

export class ConfigService {
  static getEnvConfig(): Promise<EnvConfig> {
    return fetch('http://localhost:3000/api/config/env')
      .then(res => {
        return res.json()
      })
      .then(json => {
        return json.config as EnvConfig
      })
  }

  static updateEnvConfig(
    newConfig: EnvConfig
  ): Promise<Record<'config', EnvConfig>> {
    return fetch('http://localhost:3000/api/config/env', {
      method: 'POST',
      body: JSON.stringify({ config: newConfig }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      return res.json()
    })
  }

  static getRuntimeConfig(): Promise<RuntimeConfig> {
    return fetch('http://localhost:3000/api/config/runtime')
      .then(res => {
        return res.json()
      })
      .then(json => {
        return json.config as RuntimeConfig
      })
  }

  static updateRuntimeConfig(
    newConfig: RuntimeConfig
  ): Promise<Record<'config', RuntimeConfig>> {
    return fetch('http://localhost:3000/api/config/runtime', {
      method: 'POST',
      body: JSON.stringify({ config: newConfig }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      return res.json()
    })
  }
}
