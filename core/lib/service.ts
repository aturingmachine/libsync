import { PathLike } from 'fs'
import fs from 'fs/promises'
import Config from '../utils/config/config-holder'
import { debounce } from '../utils/debounce'
import sync from './dir-sync/dir-sync'
import { Logger, logger } from '../utils/log-helper'
import LibSync from '../utils/state/state'
import EnvConfig from '../utils/config/env-config'

let watcherLogger: Logger
let rezTimer: NodeJS.Timeout
let rezCount = 0
let mounted = false

export function isWatcherMounted(): boolean {
  return mounted
}

async function initiateSync() {
  try {
    if (Config.opts.runBackUp) {
      watcherLogger.info('Attempting Backup Sync')
      await sync(true)
    }
    watcherLogger.info('Watcher Initiating Sync')
    await sync(false)
  } catch (error) {
    watcherLogger.error('Unable To Sync Libraries', error)
    throw error
  }
}

function attemptRez(srcPath: PathLike) {
  if (rezCount >= EnvConfig.get.rezAttempts) {
    watcherLogger.error(
      `${EnvConfig.get.rezAttempts} Rez Attempts failed - aborting`
    )
    clearTimeout(rezTimer)
    return
  }

  watcherLogger.warn(
    `Attempting to Resurrect Watcher in ${
      EnvConfig.get.rezCooldown / 1000
    } seconds.`
  )
  rezTimer = setTimeout(() => {
    watcherLogger.warn(`Attempting to rez. Attempt ${rezCount + 1}`)
    mountWatcher(srcPath)
    rezCount++
    clearTimeout(rezTimer)
  }, EnvConfig.get.rezCooldown)
}

async function mountWatcher(srcPath: PathLike) {
  watcherLogger.info(`Attempting to mount file watcher to ${srcPath}`)
  const debouncedSync = debounce(
    () => initiateSync(),
    EnvConfig.get.debounceAmount
  )
  let allGoodTimer: NodeJS.Timer | undefined = undefined

  try {
    const watcher = fs.watch(srcPath, {
      recursive: true,
    })

    allGoodTimer = setTimeout(() => {
      watcherLogger.info(
        `File Watcher mounted. Listening for changes to ${srcPath}`
      )
      mounted = true
      clearTimeout(allGoodTimer as NodeJS.Timer)
    }, 2500)

    for await (const _event of watcher) {
      watcherLogger.verbose('File Change Event Recieved - Debouncing')
      debouncedSync()
    }
  } catch (error) {
    if (allGoodTimer !== undefined) {
      clearTimeout(allGoodTimer)
    }
    mounted = false
    watcherLogger.error('Watcher Died - ', error)
    attemptRez(srcPath)
  }
}

async function executeMount(): Promise<any> {
  watcherLogger = logger.child({ func: 'watcher' })

  if (Config.opts.syncOnStart) {
    watcherLogger.info('Initiating Sync On Start')
    initiateSync()
  }

  LibSync.isRunningBackup = false
  return await mountWatcher(LibSync.from.dir)
}

export default executeMount
