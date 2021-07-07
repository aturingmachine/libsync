import fs from 'fs/promises'
import { Command, Commands } from '../../models/commands.js'
import { logger, Logger, LogHelper } from '../../utils/log-helper.js'
import LibSync from '../../utils/config/runtime-config/state.js'

let cmdRunnerLogger: Logger

async function executeMkdirCommands(mkdirCommands: Command[]): Promise<void> {
  for (const mkdirCommand of mkdirCommands) {
    const dir = mkdirCommand.text as string
    cmdRunnerLogger.verbose(`Running mkdir ${dir}`)
    await fs.mkdir(dir)
    cmdRunnerLogger.verbose(`mkdir ${dir} complete.`)
  }
}

async function executeCopyCommands(copyCommands: Command[]): Promise<void> {
  for (const copyCommand of copyCommands) {
    const [srcPath, destPath] = copyCommand.text as string[]
    cmdRunnerLogger.verbose(`Running Copy ${srcPath} - ${destPath}`)
    await fs.copyFile(srcPath, destPath)
    cmdRunnerLogger.verbose(`Copy Done ${srcPath} - ${destPath}`)
  }
}

async function executeCommands(commands: Commands): Promise<void> {
  cmdRunnerLogger = logger.child({ func: 'cmd-runner' })
  if (LibSync.options.isPlan) {
    return
  }

  cmdRunnerLogger.info('RUNNING MKDIR COMMANDS')
  LogHelper.start('mkdir')

  await executeMkdirCommands(commands.mkdir)
  cmdRunnerLogger.info(`Mkdir Complete in ${LogHelper.stop('mkdir')}ms.`)

  cmdRunnerLogger.info('RUNNING COPY COMMANDS')
  LogHelper.start('copy')

  await executeCopyCommands(commands.copy)
  cmdRunnerLogger.info(`Copy Complete in ${LogHelper.stop('copy')}ms.`)
}

export default executeCommands
