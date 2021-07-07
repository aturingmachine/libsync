import { Logger } from 'winston'
import { DirStructInside } from '../../models/dirs.js'
import { logger, LogHelper } from '../../utils/log-helper.js'
import LibSync from '../../utils/config/runtime-config/state.js'
import buildCommands from '../command-runner/command-mapper.js'
import executeCommands from '../command-runner/command-runner.js'
import mapDirectoryStructure from './dir-mapper.js'
import { LibSyncDatabase } from '../../db/index.js'

let syncLogger: Logger

function diffTrees(src: DirStructInside, dest: DirStructInside): string[] {
  return Object.keys(src.contents)
    .map((p) => {
      if (src.contents[p].isDir || dest?.contents?.[p]) {
        return diffTrees(src.contents[p], dest?.contents?.[p]).flat()
      } else {
        return [src.contents[p].fullRelativePath]
      }
    })
    .flat()
}

async function sync(isBackupRun: boolean): Promise<void> {
  LibSync.lock()
  syncLogger = logger.child({ func: 'sync' })
  LibSync.isRunningBackup = isBackupRun

  await Promise.all([
    mapDirectoryStructure(LibSync.from.dir, LibSync.from.name),
    mapDirectoryStructure(LibSync.to.dir, LibSync.to.name),
  ])
  syncLogger.info('Mapping Complete')

  LibSyncDatabase.writeLibSnapshot({
    libName: LibSync.from.lib,
    timestamp: Date.now(),
    path: LibSync.from.dir as string,
    dirStruct: LibSync.from.dirStruct,
  })

  const diffTag = 'diff'
  LogHelper.start('diff')
  syncLogger.info(
    `Diffing ${LibSync.from.name} and ${LibSync.to.name} Librarys`
  )
  const pathsToCopy = diffTrees(
    LibSync.from.dirStruct[LibSync.from.lib],
    LibSync.to.dirStruct[LibSync.to.lib]
  )
  syncLogger.info(
    `Diff Complete in ${LogHelper.stop(diffTag)}ms. ${
      pathsToCopy.length
    } paths need updating.`
  )

  if (pathsToCopy.length === 0) {
    syncLogger.info('No Updates to be made')
    LibSync.unlock()
    return Promise.resolve()
  }

  const fullPaths = pathsToCopy.map((path) => {
    const targetPath = path.slice(
      path.indexOf('/', path.indexOf(LibSync.from.lib))
    )

    return targetPath
  })

  const commands = buildCommands(fullPaths)

  syncLogger.debug(
    `${commands.mkdir.length} MKDIR Commands ${commands.copy.length} COPY Commands`
  )

  await executeCommands(commands)
  LibSync.unlock()
}

export default sync
