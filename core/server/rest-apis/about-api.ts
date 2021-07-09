import express from 'express'
import { logger } from '../../utils/log-helper.js'

const aboutApiLogger = logger.child({ func: 'about-api' })

const aboutApi = express()

aboutApi.use(express.json())

aboutApi.get('/api/about', (req: express.Request, res: express.Response) => {
  const response = {
    // serviceVersion: version,
    nodeLocation: process.execPath,
    cwd: process.cwd(),
    pid: process.pid,
  }

  console.log(process.cpuUsage())
  console.log(process.memoryUsage())
  console.log(process.resourceUsage())
  console.log(process.uptime()) // keep

  res.json({ about: response })
})

export default aboutApi
