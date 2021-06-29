import express from 'express'
import path from 'path'
import EnvConfig from '../utils/config/env-config'
import { ConfigurableLibSyncState } from '../utils/config/models'
import { logger } from '../utils/log-helper'
import LibSync from '../utils/state/state'

const configApiLogger = logger.child({ func: 'config-api' })

const configApi = express()

configApi.use(express.json())

configApi.get(
  '/api/config/env',
  (req: express.Request, res: express.Response) => {
    const currentConfig = EnvConfig.get

    console.log(currentConfig)
    res.json({ config: currentConfig })
  }
)

// TODO implement this
configApi.post(
  '/api/config/env',
  async (req: express.Request, res: express.Response) => {
    console.log(req.body.config)
    configApiLogger.info('Attempting to FAKE update config')

    try {
      await EnvConfig.updateConfigFields(req.body.config)
      res.status(202).json({ config: EnvConfig.get })
    } catch (error) {
      res.sendStatus(500)
      configApiLogger.error('Failed To Update EnvConfig', error)
    }
  }
)

configApi.get(
  '/api/config/runtime',
  (req: express.Request, res: express.Response) => {
    const currentConfig = LibSync.configurableState // not right

    console.log(currentConfig)
    res.json({ config: currentConfig })
  }
)

// TODO implement this
configApi.post(
  '/api/config/runtime',
  async (req: express.Request, res: express.Response) => {
    console.log(req.body.config)
    // configApiLogger.info('Attempting to FAKE update config')
    // LibSync.updateConfigFields(req.body.config)

    try {
      await LibSync.updateConfigFields(
        req.body.config as ConfigurableLibSyncState
      )
      res.status(202).json({ config: LibSync.configurableState })
    } catch (error) {
      res.sendStatus(500)
      configApiLogger.error('Failed To Update RuntimeConfig', error)
    }
  }
)

export default configApi
