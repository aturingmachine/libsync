import express from 'express'
import EnvConfig from '../utils/config/env-config/env-config'
import {
  ConfigurableLibSyncState,
  EnvConfigStruct,
} from '../utils/config/models'
import { logger } from '../utils/log-helper'
import LibSync from '../utils/config/runtime-config/state'
import fs from 'fs/promises'
import path from 'path'

const configApiLogger = logger.child({ func: 'config-api' })

const configApi = express()

configApi.use(express.json())

configApi.get(
  '/api/config/env',
  (req: express.Request, res: express.Response) => {
    const currentConfig = EnvConfig.get

    res.json({ config: currentConfig })
  }
)

configApi.post(
  '/api/config/env',
  async (req: express.Request, res: express.Response) => {
    configApiLogger.info('EnvConfig Update Recieved - Processing')

    const changedFields = Object.fromEntries(
      Object.entries(req.body.config)
        .map(([key, value]) => {
          if (EnvConfig.get[key as keyof EnvConfigStruct] === value) {
            return [key, undefined]
          } else {
            return [key, value]
          }
        })
        .filter(([_key, value]) => !!value)
    )

    try {
      configApiLogger.info('Locking State for EnvConfig Update')
      LibSync.lock()
      await EnvConfig.updateConfigFields(changedFields)
      await fs.writeFile(
        path.resolve(__dirname, '../../.config.json'),
        JSON.stringify({ ...EnvConfig.get }, null, 2)
      )
      configApiLogger.info('EnvConfig Update complete - Unlocking')
      res.status(202).json({ config: EnvConfig.get })
      LibSync.unlock()
    } catch (error) {
      res.sendStatus(500)
      configApiLogger.error('Failed To Update EnvConfig', error)
    }
  }
)

configApi.get(
  '/api/config/runtime',
  (req: express.Request, res: express.Response) => {
    const currentConfig = LibSync.configurableState

    res.json({ config: currentConfig })
  }
)

configApi.post(
  '/api/config/runtime',
  async (req: express.Request, res: express.Response) => {
    configApiLogger.info('RuntimeConfig Update Recieved - Processing')

    const changedFields = Object.fromEntries(
      Object.entries(req.body.config)
        .map(([key, value]) => {
          if (LibSync.state[key as keyof ConfigurableLibSyncState] === value) {
            return [key, undefined]
          } else {
            return [key, value]
          }
        })
        .filter(([_key, value]) => !!value)
    )

    try {
      configApiLogger.info('Locking State for RuntimeConfig Update')
      LibSync.lock()
      await LibSync.updateConfigFields(
        changedFields as ConfigurableLibSyncState
      )
      configApiLogger.info('RuntimeConfig Update complete - Unlocking')
      res.status(202).json({ config: LibSync.configurableState })
      LibSync.unlock()
    } catch (error) {
      res.sendStatus(500)
      configApiLogger.error('Failed To Update RuntimeConfig', error)
    }
  }
)

export default configApi
