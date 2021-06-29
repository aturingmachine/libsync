type OptFlag = {
  [key in keyof LibSyncOpts]: {
    longFlag: string
    shortFlag: string
    helpMsg: string
  }
}

export const optsFlags: OptFlag = {
  isKill: {
    longFlag: 'kill',
    shortFlag: 'k',
    helpMsg: 'Exit The Process Early without running any syncs',
  },
  isPlan: {
    longFlag: 'plan',
    shortFlag: 'p',
    helpMsg: 'Display what running the scan would do and exit',
  },
  runOnce: {
    longFlag: 'run-once',
    shortFlag: 'r',
    helpMsg: 'Runs LibSync once over the provided libraries.',
  },
  isDebug: {
    longFlag: 'debug',
    shortFlag: 'd',
    helpMsg:
      'Will increase the amount of logs written to the log files as well as writing logs to the console',
  },
  syncOnStart: {
    longFlag: 'sync-on-start',
    shortFlag: 'o',
    helpMsg:
      'When run in addition to service mode will attempt to run a sync cycle on start',
  },
  runBackUp: {
    longFlag: 'backup',
    shortFlag: 'b',
    helpMsg:
      'Will execute a sync of the destination directory to the provided ',
  },
  runHelp: {
    longFlag: 'help',
    shortFlag: 'h',
    helpMsg: 'Display this message',
  },
  isHeadless: {
    longFlag: 'headless',
    shortFlag: 'H',
    helpMsg: 'Run LibSync without the API or Admin Client',
  },
}
Object.freeze(optsFlags)

export const getOptsFlags = (): OptFlag => {
  return optsFlags
}

export type LibSyncDirConfig = {
  src: string
  dest: string
  backup: string
}

// Rename some of these to make more sense
export type LibSyncOpts = {
  isKill: boolean
  isPlan: boolean
  runOnce: boolean
  isDebug: boolean
  syncOnStart: boolean
  runBackUp: boolean
  runHelp: boolean
  isHeadless: boolean
}

export type ConfigurableLibSyncState = {
  dirs: LibSyncDirConfig
  libs: LibSyncDirConfig
  options: Pick<LibSyncOpts, 'isDebug' | 'runBackUp' | 'syncOnStart'>
}

export type EnvConfigStruct = {
  srcDir: string
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
  rezCooldown: number
  options: LibSyncOpts
}
