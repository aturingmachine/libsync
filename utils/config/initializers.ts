import { DirStruct } from '../../models/dirs'
import { initLogger, logger } from '../log-helper'
import Config from './config-holder'
import { getCliArg } from './config-utils'
import EnvConfig from './env-config'
import { getOptsFlags, LibSyncOpts } from './models'

export const initOpts = (): void => {
  const cliArgs = process.argv

  Object.keys(Config.opts).forEach((opt) => {
    Config.opts[opt as keyof LibSyncOpts] = getOptsFlags()[opt].flags.some(
      (flag) => cliArgs.includes(flag)
    )
  })

  initLogger()
}

export const initRoots = (
  src: DirStruct,
  dest: DirStruct,
  backup?: DirStruct
): void => {
  Config.roots = {
    src: Object.keys(src)[0],
    dest: Object.keys(dest)[0],
    backup: backup ? Object.keys(backup)[0] : '',
  }
}

export const initDirs = (): void => {
  const resolvedSrcDir = getCliArg(process.argv, 'src=') || EnvConfig.get.srcDir
  const resolveDestDir =
    getCliArg(process.argv, 'dest=') || EnvConfig.get.destDir
  const resolvedBackupDir =
    getCliArg(process.argv, 'backupDir=') || EnvConfig.get.backupDir

  if (!resolvedSrcDir || !resolveDestDir) {
    logger.error(
      `Missing Dir Paths SRC: ${resolvedSrcDir} DEST: ${resolveDestDir}`
    )
    throw new Error('No Dir Path Provided')
  }

  if (Config.opts.runBackUp && !resolvedBackupDir) {
    logger.error(
      `No Backup dir provided for Backup option: ${resolvedBackupDir}`
    )
    throw new Error('No Backup Dir Path Provided')
  }

  Config.dirs = {
    src: resolvedSrcDir,
    dest: resolveDestDir,
    backup: resolvedBackupDir || '',
  }

  Config.libs = {
    src: Config.dirs.src.split('/')[Config.dirs.src.split('/').length - 1],
    dest: Config.dirs.dest.split('/')[Config.dirs.dest.split('/').length - 1],
    backup:
      Config.dirs.backup.split('/')[Config.dirs.backup.split('/').length - 1],
  }
}
