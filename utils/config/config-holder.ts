import { initDirs, initOpts, initRoots } from './initializers'
import { baseDirConf, LibSyncConfig } from './models'

const Config: LibSyncConfig = {
  isLocked: false,
  opts: {
    isKill: false,
    isPlan: false,
    isService: false,
    isDebug: false,
    syncOnStart: false,
    runBackUp: false,
    runHelp: false,
  },
  dirs: { ...baseDirConf },
  libs: { ...baseDirConf },
  roots: { ...baseDirConf },

  init: {
    opts: initOpts,
    dirs: initDirs,
    roots: initRoots,
  },
}

export default Config
