export interface EnvConfig {
  srcDir: string
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
  rezCooldown: number
}

interface LibSyncDirConfig {
  src: string
  dest: string
  backup: string
}

export interface LibSyncOpts {
  isKill: boolean
  isPlan: boolean
  isService: boolean
  isDebug: boolean
  syncOnStart: boolean
  runBackUp: boolean
  runHelp: boolean
  runClient: boolean
}

export interface RunTimeConfig {
  opts: LibSyncOpts
  dirs: LibSyncDirConfig
  libs: LibSyncDirConfig
  roots: LibSyncDirConfig // TODO believe this is unused atm
  isLocked: boolean

  init: {
    opts: () => void
    dirs: () => void
  }
}
