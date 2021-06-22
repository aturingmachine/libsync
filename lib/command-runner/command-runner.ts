import fs from 'fs/promises'
import { Command, Commands } from '../../models/commands'
import Config from '../../utils/config/config-holder'
import { logger, LogHelper, Logger } from '../../utils/log-helper'

let cmdRunnerLogger: Logger

async function executeMkdirCommands(mkdirCommands: Command[]): Promise<any> {
  return await mkdirCommands.reduce(async (prev, curr) => {
    cmdRunnerLogger.verbose(`Running mkdir ${curr.text}`)
    await prev
    cmdRunnerLogger.verbose(`mkdir ${curr.text} complete.`)
    return fs.mkdir(curr.text as string)
  }, Promise.resolve())
}

function makeCopyCommands(copyCommands: Command[]): Promise<any>[] {
  return copyCommands.map((command) => {
    const [srcPath, destPath] = command.text as string[]
    cmdRunnerLogger.verbose(`Running Copy ${srcPath} - ${destPath}`)
    return fs
      .copyFile(srcPath, destPath)
      .then((_) =>
        cmdRunnerLogger.verbose(`Copy Done ${srcPath} - ${destPath}`)
      )
  })
}

async function executeCommands(commands: Commands): Promise<any> {
  cmdRunnerLogger = logger.child({ func: 'cmd-runner' })
  if (Config.opts.isPlan) {
    return Promise.resolve()
  }

  cmdRunnerLogger.info('RUNNING MKDIR COMMANDS')
  LogHelper.start('mkdir')

  await executeMkdirCommands(commands.mkdir).then((_) =>
    cmdRunnerLogger.info(`Mkdir Complete in ${LogHelper.stop('mkdir')}ms.`)
  )

  cmdRunnerLogger.info('RUNNING COPY COMMANDS')
  LogHelper.start('copy')

  await Promise.all(makeCopyCommands(commands.copy)).then((_) =>
    cmdRunnerLogger.info(`Copy Complete in ${LogHelper.stop('copy')}ms.`)
  )
}

export default executeCommands
