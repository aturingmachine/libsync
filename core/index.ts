import { initLogger, logger, Logger } from './utils/log-helper'
import sync from './lib/dir-sync/dir-sync'
import executeMount from './lib/service'
import { logHelpMessage } from './utils/help-log'
import EnvConfig from './utils/config/env-config'
import mountApi from './server'
import LibSync from './utils/state/state'

let mainLogger: Logger

async function runOnce(): Promise<any> {
  if (LibSync.options.runBackUp) {
    mainLogger.info('Running Backup Sync')
    await sync(true)
  }
  return await sync(false)
}

async function init() {
  await EnvConfig.init()

  LibSync.state // TODO this is a fucked up way to init lol
  initLogger()

  if (LibSync.options.runHelp) {
    logHelpMessage()
  }

  mainLogger = logger.child({ func: 'main' })
  mainLogger.info('LibSync Initialised.')
}

const main = async () => {
  await init()

  mainLogger.log(
    'info',
    'Running with opts src: %s dest: %s debug: %s service: %s',
    LibSync.dirs.src,
    LibSync.dirs.dest,
    LibSync.options.isDebug,
    LibSync.options.isService,
    {
      opts: {
        src: LibSync.dirs.src,
        dest: LibSync.dirs.dest,
        opts: { ...LibSync.options },
      },
    }
  )

  if (LibSync.options.isService) {
    mainLogger.info('Mounting LibSync Service')
    executeMount()

    if (LibSync.options.runClient) {
      mountApi()
    }
  } else {
    mainLogger.info('Running Singular Sync')
    runOnce()
  }
}

main()

module.exports = main
