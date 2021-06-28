import express from 'express'
import path from 'path'
import Config from '../utils/config/config-holder'
import EnvConfig from '../utils/config/env-config'
import { logger } from '../utils/log-helper'

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
  (req: express.Request, res: express.Response) => {
    console.log(req.body.config)
    configApiLogger.info('Attempting to FAKE update config')
    EnvConfig.updateConfigFields({ srcDir: './some/new/value' })
    res.sendStatus(200)
  }
)

configApi.get(
  '/api/config/runtime',
  (req: express.Request, res: express.Response) => {
    const { init, roots, ...currentConfig } = Config

    console.log(currentConfig)
    res.json({ config: currentConfig })
  }
)

// TODO implement this
configApi.post(
  '/api/config/runtime',
  (req: express.Request, res: express.Response) => {
    console.log(req.body.config)
    // configApiLogger.info('Attempting to FAKE update config')
    // EnvConfig.updateConfigFields({ srcDir: './some/new/value' })
    res.sendStatus(200)
  }
)

export default configApi
