import fs from 'fs/promises'
import { constants } from 'fs'
import { Command, Commands } from '../../models/commands.js'
import { logger, Logger, LogHelper } from '../../utils/log-helper.js'
import LibSync from '../../utils/config/runtime-config/state.js'

let cmdRunnerLogger: Logger

async function executeMkdirCommands(mkdirCommands: Command[]): Promise<void> {
  for (const mkdirCommand of mkdirCommands) {
    const dir = mkdirCommand.text as string
    cmdRunnerLogger.verbose(`Running mkdir ${dir}`)
    try {
      await fs.mkdir(dir)
      cmdRunnerLogger.verbose(`mkdir ${dir} complete.`)
    } catch (error) {
      if (error.code === 'EEXIST') {
        cmdRunnerLogger.warn(
          `${dir} already exists, skipping mkdir. This most likely is caused by a case-insensitive filesystem.`
        )
      }
    }
  }
}

async function executeCopyCommands(copyCommands: Command[]): Promise<void> {
  for (const copyCommand of copyCommands) {
    const [srcPath, destPath] = copyCommand.text as string[]
    cmdRunnerLogger.verbose(`Running Copy ${srcPath} - ${destPath}`)
    try {
      await fs.copyFile(srcPath, destPath, constants.COPYFILE_EXCL)
      cmdRunnerLogger.verbose(`Copy Done ${srcPath} - ${destPath}`)
    } catch (error) {
      if (error.code === 'EEXIST') {
        cmdRunnerLogger.warn(
          `${destPath} already exists, skipping copy. This most likely is caused by a case-insensitive filesystem.`
        )
      }
    }
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
