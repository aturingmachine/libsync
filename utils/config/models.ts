import { DirStruct } from '../../models/dirs'

interface OptFlag {
  [key: string]: { flags: string[]; helpMsg: string }
}

const optsFlags: OptFlag = {
  isKill: {
    flags: ['kill', '-k'],
    helpMsg: 'Exit The Process Early without running any syncs',
  },
  isPlan: {
    flags: ['plan', '-p'],
    helpMsg: 'Display what running the scan would do and exit',
  },
  isService: {
    flags: ['service', '-s'],
    helpMsg:
      'Runs LibSync as a service mounting a file watcher to the provided src library. Will debounce changes to the src library ',
  },
  isDebug: {
    flags: ['debug', '-d'],
    helpMsg:
      'Will increase the amount of logs written to the log files as well as writing logs to the console',
  },
  syncOnStart: {
    flags: ['sync-on-start', '-o'],
    helpMsg:
      'When run in addition to service mode will attempt to run a sync cycle on start',
  },
  runBackUp: {
    flags: ['backup', '-b'],
    helpMsg:
      'Will execute a sync of the destination directory to the provided ',
  },
  runHelp: {
    flags: ['help', '-h'],
    helpMsg: 'Display this message',
  },
}
Object.freeze(optsFlags)

export const getOptsFlags = (): OptFlag => {
  return optsFlags
}

interface LibSyncDirConfig {
  src: string
  dest: string
  backup: string
}

export const baseDirConf: LibSyncDirConfig = {
  src: '',
  dest: '',
  backup: '',
}

export interface LibSyncOpts {
  isKill: boolean
  isPlan: boolean
  isService: boolean
  isDebug: boolean
  syncOnStart: boolean
  runBackUp: boolean
  runHelp: boolean
}

export interface LibSyncConfig {
  opts: LibSyncOpts
  dirs: LibSyncDirConfig
  libs: LibSyncDirConfig
  roots: LibSyncDirConfig
  isLocked: boolean

  init: {
    opts: () => void
    dirs: () => void
    roots: (src: DirStruct, dest: DirStruct) => void
  }
}
