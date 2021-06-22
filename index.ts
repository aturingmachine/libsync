import { logger, Logger } from './utils/log-helper'
import Config from './utils/config/config-holder'
import sync from './lib/dir-sync/dir-sync'
import executeMount from './lib/service'
import { logHelpMessage } from './utils/help-log'
import EnvConfig from './utils/config/env-config'

let mainLogger: Logger

async function runOnce(): Promise<any> {
  if (Config.opts.runBackUp) {
    mainLogger.info('Running Backup Sync')
    await sync(true)
  }
  return await sync(false)
}

async function init() {
  await EnvConfig.init()

  Config.init.opts()

  if (Config.opts.runHelp) {
    logHelpMessage()
  }

  mainLogger = logger.child({ func: 'main' })
  mainLogger.info('Initialising LibSync')
  Config.init.dirs()
  mainLogger.info('LibSync Initialised.')
}

const main = async () => {
  await init()

  mainLogger.log(
    'info',
    'Running with opts src: %s dest: %s debug: %s service: %s',
    Config.dirs.src,
    Config.dirs.dest,
    Config.opts.isDebug,
    Config.opts.isService,
    {
      opts: {
        src: Config.dirs.src,
        dest: Config.dirs.dest,
        opts: { ...Config.opts },
      },
    }
  )

  if (Config.opts.isService) {
    mainLogger.info('Mounting LibSync Service')
    executeMount()
  } else {
    mainLogger.info('Running Singular Sync')
    runOnce()
  }
}

main()

module.exports = main
