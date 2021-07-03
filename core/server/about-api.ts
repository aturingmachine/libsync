import express from 'express'
import fs from 'fs/promises'
import EnvConfig from '../utils/config/env-config/env-config'
import { Logger, logger } from '../utils/log-helper'
import { version } from '../package.json'

const aboutApiLogger = logger.child({ func: 'about-api' })

const aboutApi = express()

aboutApi.use(express.json())

aboutApi.get('/api/about', (req: express.Request, res: express.Response) => {
  const response = {
    serviceVersion: version,
    nodeLocation: process.execPath,
    cwd: process.cwd(),
    pid: process.pid,
  }

  res.json({ about: response })
})

export default aboutApi
