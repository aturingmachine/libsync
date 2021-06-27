import { PathLike } from 'fs'
import { DirStruct, TargetName } from '../../models/dirs'
import Config from '../config/config-holder'
import { Logger, logger } from '../log-helper'

interface SyncTarget {
  name: TargetName
  dir: PathLike
  lib: string
  dirStruct: DirStruct
}

interface SyncTargets {
  from: SyncTarget
  to: SyncTarget
}

class LibSyncStateRecord {
  private srcDirStructure: DirStruct = {}
  private destDirStructure: DirStruct = {}
  private backupDirStructure: DirStruct = {}

  get src(): DirStruct {
    return this.srcDirStructure
  }

  get dest(): DirStruct {
    return this.destDirStructure
  }

  get backup(): DirStruct {
    return this.backupDirStructure
  }
}

class LibSyncState {
  private _state!: LibSyncStateRecord
  private logger: Logger = logger.child({ func: 'state' })
  private _isRunningBackup = false
  private _to!: SyncTarget
  private _from!: SyncTarget

  get state(): LibSyncStateRecord {
    if (!this._state) {
      this.logger.info('Initializing new Lib Sync State')
      this._state = new LibSyncStateRecord()
    }

    return this._state
  }

  get src(): DirStruct {
    return this.state.src
  }

  get dest(): DirStruct {
    return this.state.dest
  }

  get backup(): DirStruct {
    return this.state.backup
  }

  get srcTarget(): SyncTarget {
    return {
      name: TargetName.Source,
      dir: Config.dirs.src,
      lib: Config.libs.src,
      dirStruct: LibSync.src,
    }
  }

  get destTarget(): SyncTarget {
    return {
      name: TargetName.Target,
      dir: Config.dirs.dest,
      lib: Config.libs.dest,
      dirStruct: LibSync.dest,
    }
  }

  get backupTarget(): SyncTarget {
    return {
      name: TargetName.Backup,
      dir: Config.dirs.backup,
      lib: Config.libs.backup,
      dirStruct: LibSync.backup,
    }
  }

  get syncTargetConf(): SyncTargets {
    return {
      from: this.srcTarget,
      to: this.destTarget,
    }
  }

  get backupTargetConf(): SyncTargets {
    return {
      from: this.destTarget,
      to: this.backupTarget,
    }
  }

  get to(): SyncTarget {
    return this._to
  }

  get from(): SyncTarget {
    return this._from
  }

  get isRunningBackup(): boolean {
    return this._isRunningBackup
  }

  set isRunningBackup(isBackupRun: boolean) {
    this._isRunningBackup = isBackupRun

    if (this._isRunningBackup) {
      this._from = this.backupTargetConf.from
      this._to = this.backupTargetConf.to
    } else {
      this._from = this.syncTargetConf.from
      this._to = this.syncTargetConf.to
    }
  }
}

const LibSync = new LibSyncState()

export default LibSync
