import { initLogger, logger, Logger } from './utils/log-helper.js'
import sync from './lib/dir-sync/dir-sync.js'
import executeMount from './lib/service.js'
import { logHelpMessage } from './utils/help-log.js'
import EnvConfig from './utils/config/env-config/env-config.js'
import mountApi from './server/index.js'
import LibSync from './utils/config/runtime-config/state.js'
import { LibSyncDatabase } from './db/index.js'
import { FileSystemHelper } from './utils/filesystem-helper.js'

let mainLogger: Logger

async function runOnce(): Promise<void> {
  if (LibSync.options.runBackUp) {
    mainLogger.info('Running Backup Sync')
    await sync(true)
  }
  return await sync(false)
}

async function init() {
  await EnvConfig.init()

  FileSystemHelper.checkFSCaseSensitivity()

  console.log('>>>>>>>>>>> CASE SENSITIVE', EnvConfig.caseSensitiveFs)

  LibSync.state // TODO this is a fucked up way to init lol
  initLogger()

  if (LibSync.options.runHelp) {
    logHelpMessage()
  }

  await LibSyncDatabase.init()

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
    LibSync.options.runOnce,
    {
      opts: {
        src: LibSync.dirs.src,
        dest: LibSync.dirs.dest,
        opts: { ...LibSync.options },
      },
    }
  )

  if (!LibSync.options.runOnce) {
    mainLogger.info('Mounting LibSync Service')
    executeMount()

    if (!LibSync.options.isHeadless) {
      mountApi()
    }
  } else {
    mainLogger.info('Running Singular Sync')
    runOnce()
  }
  LibSync.unlock()
}

main()
