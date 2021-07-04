import express from 'express'
import fs from 'fs/promises'
import EnvConfig from '../../utils/config/env-config/env-config'
import { Logger, logger } from '../../utils/log-helper'

function mountLogsRouter(): express.Express {
  const log: Logger = logger.child({ func: 'logs-api' })
  const app = express()

  app.use(express.json())

  app.get(
    '/api/logs/all',
    async (req: express.Request, res: express.Response) => {
      try {
        const logs = await fs.readFile(EnvConfig.get.combinedLogsOutputDir, {
          encoding: 'utf-8',
        })

        const logsArray = logs.split('\n')
        logsArray.pop()

        const parsedLogs = logsArray.map((rawLog) => JSON.parse(rawLog))

        res.json({ logs: parsedLogs })
      } catch (error) {
        log.error('Error fetching logs', error)
      }
    }
  )

  return app
}

export default mountLogsRouter
