import { PathLike } from 'fs'
import { DirStruct } from '../../models'
import Config from '../../utils/config/config-holder'
import { logger, Logger } from '../../utils/log-helper'

let backupLogger: Logger

async function backupDir(): Promise<any> {
  backupLogger = logger.child({ func: 'backup-dest' })
  const dest: PathLike = Config.dirs.dest
  const backup: PathLike = Config.dirs.backup
}
