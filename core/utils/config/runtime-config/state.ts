import { PathLike } from 'fs'
import { DirStruct, TargetName } from '../../../models/dirs'
import {
  getLibFromDir,
  parseCliDirs,
  RuntimeConfigvalidator,
} from '../config-utils'
import EnvConfig from '../env-config/env-config'
import {
  ConfigurableLibSyncState,
  EnvConfigStruct,
  LibSyncDirConfig,
  LibSyncOpts,
  optsFlags,
} from '../models'
import { EventBinder, EventHandler } from '../../event-binder'
import { Logger, logger } from '../../log-helper'

declare type Lockhandler = (lockStatus: boolean) => any

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

class LibSyncOptsRecord {
  private _options!: LibSyncOpts

  constructor() {
    this.initOpts()
    EnvConfig.listen(['options']).call(this.handleEnvUpdate.bind(this))
  }

  get record(): LibSyncOpts {
    return { ...this._options }
  }

  update(
    values: Pick<LibSyncOpts, 'isDebug' | 'syncOnStart' | 'runBackUp'>
  ): void {
    this._options = {
      ...this._options,
      ...values,
    }
  }

  private initOpts(): void {
    // Get all flags turned on by Command Line Args
    const args = process.argv.slice(2)
    const shortFlags = args
      .find((a) => /^-[A-Za-z]+/.test(a))
      ?.slice(1)
      .split('')

    const cliOptions = Object.fromEntries(
      Object.entries(optsFlags)
        .filter(
          ([key, opt]) =>
            args.includes(opt.longFlag) ||
            args.includes(`--${opt.longFlag}`) ||
            shortFlags?.includes(opt.shortFlag)
        )
        .map(([key, opt]) => {
          return [key, true]
        })
    ) as LibSyncOpts

    // Merge config'ed options and parsed options
    this._options = { ...EnvConfig.get.options, ...cliOptions }
  }

  private handleEnvUpdate(
    field: keyof EnvConfigStruct,
    _value: string | number | LibSyncOpts
  ): Promise<void> {
    if (field === 'options') {
      this.initOpts()
    }

    return Promise.resolve()
  }
}

/**
 * Inner Class for holding the actual state.
 * This allows us to abstract a bit of how the state is consumed
 * and makes the main state a bit cleaner maybe.
 */
class LibSyncStateRecord {
  private _isLocked = false
  private _dirs!: LibSyncDirConfig
  private _libs!: LibSyncDirConfig
  private _options!: LibSyncOptsRecord
  private logger!: Logger
  private srcDirStructure: DirStruct = {}
  private destDirStructure: DirStruct = {}
  private backupDirStructure: DirStruct = {}
  private _lockEventListeners: Lockhandler[] = []

  constructor(logger: Logger) {
    this.logger = logger
    this._options = new LibSyncOptsRecord()
    this.initDirs()
    this.initLibs()

    EnvConfig.listen(['srcDir', 'destDir', 'backupDir']).call(
      this.handleEnvUpdate.bind(this)
    )
  }

  get src(): DirStruct {
    return this.srcDirStructure
  }

  get dest(): DirStruct {
    return this.destDirStructure
  }

  get backup(): DirStruct {
    return this.backupDirStructure
  }

  get options(): LibSyncOpts {
    return this._options.record
  }

  get dirs(): LibSyncDirConfig {
    return { ...this._dirs }
  }

  get libs(): LibSyncDirConfig {
    return { ...this._libs }
  }

  get isLocked(): boolean {
    return this._isLocked
  }

  set isLocked(newVal: boolean) {
    this._isLocked = newVal
    this._lockEventListeners.forEach((cb) => {
      cb(newVal)
    })
  }

  addLockHander(handler: Lockhandler): void {
    this._lockEventListeners.push(handler)
  }

  removeLockhandler(handler: Lockhandler): void {
    this._lockEventListeners.splice(
      this._lockEventListeners.indexOf(handler),
      1
    )
  }

  get configurableOptions(): Pick<
    LibSyncOpts,
    'isDebug' | 'syncOnStart' | 'runBackUp'
  > {
    return {
      isDebug: this.options.isDebug,
      syncOnStart: this.options.syncOnStart,
      runBackUp: this.options.runBackUp,
    }
  }

  update(
    key: '_dirs' | '_libs' | '_options',
    value:
      | LibSyncDirConfig
      | Pick<LibSyncOpts, 'isDebug' | 'syncOnStart' | 'runBackUp'>
  ): void {
    if (key !== '_options') {
      this[key] = value as LibSyncDirConfig
    } else {
      this._options.update(
        value as Pick<LibSyncOpts, 'isDebug' | 'syncOnStart' | 'runBackUp'>
      )
    }
  }

  private initDirs(): void {
    const { resolvedSrcDir, resolveDestDir, resolvedBackupDir } = parseCliDirs()

    if (!resolvedSrcDir || !resolveDestDir) {
      this.logger.error(
        `Missing Dir Paths SRC: ${resolvedSrcDir} DEST: ${resolveDestDir}`
      )
      throw new Error('No Dir Path Provided')
    }

    if (this._options.record.runBackUp && !resolvedBackupDir) {
      this.logger.error(
        `No Backup dir provided for Backup option: ${resolvedBackupDir}`
      )
      throw new Error('No Backup Dir Path Provided')
    }

    this._dirs = {
      src: resolvedSrcDir,
      dest: resolveDestDir,
      backup: resolvedBackupDir || '',
    }
  }

  private initLibs(): void {
    this._libs = {
      src: getLibFromDir(this._dirs.src),
      dest: getLibFromDir(this._dirs.dest),
      backup: getLibFromDir(this._dirs.backup),
    }
  }

  private handleEnvUpdate(
    field: keyof EnvConfigStruct,
    _value: string | number | LibSyncOpts
  ): Promise<void> {
    if (field === 'options') {
    } else {
      this.initDirs()
      this.initLibs()
    }

    return Promise.resolve()
  }
}

class LibSyncState {
  private _state!: LibSyncStateRecord
  private logger!: Logger
  private _isRunningBackup = false
  private _to!: SyncTarget
  private _from!: SyncTarget
  private eventBinder!: EventBinder<ConfigurableLibSyncState>

  get state(): LibSyncStateRecord {
    if (!this._state) {
      this.logger = logger.child({ func: 'state' })
      this.logger.info('Initializing new Lib Sync State')
      this._state = new LibSyncStateRecord(logger)
    }

    return this._state
  }

  get options(): LibSyncOpts {
    return this.state.options
  }

  get dirs(): LibSyncDirConfig {
    return this.state.dirs
  }

  get libs(): LibSyncDirConfig {
    return this.state.libs
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
      dir: this._state.dirs.src,
      lib: this._state.libs.src,
      dirStruct: LibSync.src,
    }
  }

  get destTarget(): SyncTarget {
    return {
      name: TargetName.Target,
      dir: this._state.dirs.dest,
      lib: this._state.libs.dest,
      dirStruct: LibSync.dest,
    }
  }

  get backupTarget(): SyncTarget {
    return {
      name: TargetName.Backup,
      dir: this._state.dirs.backup,
      lib: this._state.libs.backup,
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

  get isLocked(): boolean {
    return this._state.isLocked
  }

  lock(): void {
    this._state.isLocked = true
  }

  unlock(): void {
    this._state.isLocked = false
  }

  lockStatus = {
    on: (handler: Lockhandler) => {
      this.state.addLockHander(handler)
    },
    off: (handler: Lockhandler) => {
      this.state.removeLockhandler(handler)
    },
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

  get configurableState(): ConfigurableLibSyncState {
    return {
      dirs: { ...this.state.dirs },
      libs: { ...this.state.libs },
      options: {
        isDebug: this.options.isDebug,
        runBackUp: this.options.runBackUp,
        syncOnStart: this.options.syncOnStart,
      },
    }
  }

  listen<K extends keyof ConfigurableLibSyncState>(
    properties: Array<K>
  ): {
    call: (handler: EventHandler<K, ConfigurableLibSyncState>) => void
  } {
    if (!this.eventBinder) {
      this.eventBinder = new EventBinder()
    }

    return this.eventBinder.on(properties)
  }

  updateConfigFields(
    changedFields: Partial<ConfigurableLibSyncState>
  ): Promise<any> {
    if (!this.eventBinder) {
      this.eventBinder = new EventBinder()
    }

    return Promise.all(
      Object.keys(changedFields).map(async (key) => {
        const typedKey = key as keyof ConfigurableLibSyncState
        const newValue = changedFields[typedKey]
        if (newValue && RuntimeConfigvalidator[typedKey].valid(newValue)) {
          this._update(typedKey, changedFields[typedKey])
          await this.eventBinder.triggerUpdate(typedKey, newValue)
        }
      })
    )
  }

  _update(
    key: keyof ConfigurableLibSyncState,
    val:
      | LibSyncDirConfig
      | Pick<LibSyncOpts, 'isDebug' | 'syncOnStart' | 'runBackUp'>
      | undefined
  ) {
    if (val === undefined) {
      return
    }

    this.state.update(`_${key}`, val)
  }
}

const LibSync = new LibSyncState()

export default LibSync
