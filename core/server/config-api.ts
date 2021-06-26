import express from 'express'
import path from 'path'
import EnvConfig from '../utils/config/env-config'

const configApi = express()

configApi.use(express.json())

configApi.get('/api/config', (req: express.Request, res: express.Response) => {
  const currentConfig = EnvConfig.get

  console.log(currentConfig)
  res.json({ config: currentConfig })
})

// TODO implement this
configApi.post('/api/config', (req: express.Request, res: express.Response) => {
  console.log(req.body.config)
  res.sendStatus(200)
})

export default configApi
