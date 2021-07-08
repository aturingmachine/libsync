import express from 'express'
import fs from 'fs/promises'
import { LibSyncDatabase } from '../../db/index.js'
import EnvConfig from '../../utils/config/env-config/env-config.js'
import { Logger, logger } from '../../utils/log-helper.js'

const snapshotApiLog = logger.child({ func: 'snapshot-api' })

const snapshotApi = express()

snapshotApi.use(express.json())

snapshotApi.get(
  '/api/snapshots',
  (req: express.Request, res: express.Response) => {
    try {
      const snapshots = LibSyncDatabase.libSnapshots

      res.json(snapshots)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
)

export default snapshotApi
