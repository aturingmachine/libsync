import fs from 'fs/promises'
import EnvConfig from './env-config/env-config.js'
import {
  ConfigurableLibSyncState,
  EnvConfigStruct,
  LibSyncDirConfig,
  LibSyncOpts,
} from './models.js'

/**
 * STATE HELPERS
 */

function getCliArg(argv: string[], key: string): string {
  const possibleMatches = argv.filter((arg) => arg.includes(key)).reverse()
  const finalArg = possibleMatches[0]

  if (finalArg?.includes('=')) {
    return finalArg.split('=')[1]
  }
  return finalArg
}

function parseCliDirs(): {
  resolvedSrcDir: string
  resolveDestDir: string
  resolvedBackupDir: string
} {
  const resolvedSrcDir = getCliArg(process.argv, 'src=') || EnvConfig.get.srcDir
  const resolveDestDir =
    getCliArg(process.argv, 'dest=') || EnvConfig.get.destDir
  const resolvedBackupDir =
    getCliArg(process.argv, 'backupDir=') || EnvConfig.get.backupDir

  return { resolvedSrcDir, resolveDestDir, resolvedBackupDir }
}

function getLibFromDir(dirPath: string): string {
  return dirPath.split('/')[dirPath.split('/').length - 1]
}

const dirConfigValidator = {
  type: 'paths',
  valid: (newVal: LibSyncDirConfig): boolean => {
    return Object.keys(newVal).every(async (key) => {
      try {
        const candidate = await fs.lstat(newVal[key as keyof LibSyncDirConfig])
        return candidate.isDirectory()
      } catch (error) {
        return false
      }
    })
  },
}

const RuntimeConfigvalidator: {
  [k in keyof ConfigurableLibSyncState]: {
    type: string
    valid: (newVal: any) => boolean | Promise<boolean>
  }
} = {
  dirs: dirConfigValidator,
  libs: dirConfigValidator,
  options: {
    type: 'object',
    valid: (
      newVal: Pick<LibSyncOpts, 'isDebug' | 'syncOnStart' | 'runBackUp'>
    ): boolean => {
      return Object.keys(newVal).every(
        (key) =>
          typeof newVal[
            key as keyof Pick<
              LibSyncOpts,
              'isDebug' | 'syncOnStart' | 'runBackUp'
            >
          ] === 'boolean'
      )
    },
  },
}

/**
 * ENVCONFIG HELPERS
 */

const defaultEnvConfigOptions: LibSyncOpts = {
  isKill: false,
  isPlan: false,
  runOnce: false,
  isDebug: false,
  syncOnStart: false,
  runBackUp: false,
  runHelp: false,
  isHeadless: false,
}

const dirValidator = {
  type: 'string',
  valid: async (newVal: any): Promise<boolean> => {
    try {
      const candidate = await fs.lstat(newVal)
      return candidate.isDirectory()
    } catch (error) {
      return false
    }
  },
}

// TODO can probs be a class be more clean/type safe?
const EnvConfigValidator: {
  [k in keyof EnvConfigStruct]: {
    type: string
    valid: (newVal: any) => boolean | Promise<boolean>
  }
} = {
  srcDir: dirValidator,
  destDir: dirValidator,
  backupDir: dirValidator,
  combinedLogsOutputDir: dirValidator,
  errorLogsOutputdir: dirValidator,
  debounceAmount: {
    type: 'number',
    valid: (newVal: any): boolean => {
      return typeof newVal === 'number' && newVal > 5000
    },
  },
  rezAttempts: {
    type: 'number',
    valid: (newVal: any): boolean => {
      return typeof newVal === 'number' && newVal > -2
    },
  },
  rezCooldown: {
    type: 'number',
    valid: (newVal: any): boolean => {
      return typeof newVal === 'number' && newVal > 1000
    },
  },
  options: {
    type: 'object',
    valid: (newVal: any): boolean => {
      return Object.keys(newVal).every(
        (key) =>
          typeof newVal[key] === 'boolean' &&
          defaultEnvConfigOptions[key as keyof LibSyncOpts] !== undefined
      )
    },
  },
}

function shouldDefault(val: number | string | undefined): boolean {
  if (typeof val === 'number') {
    return !val
  } else {
    return !val || !val.toString().length
  }
}

function getDefault(
  key: keyof EnvConfigStruct,
  val: number | string,
  defaultEnvConfig: EnvConfigStruct
) {
  return shouldDefault(val) ? defaultEnvConfig[key] : val
}

function parseDefaults(
  config: EnvConfigStruct,
  defaultConfig: EnvConfigStruct
): EnvConfigStruct {
  return {
    srcDir: getDefault('srcDir', config.srcDir, defaultConfig) as string,
    destDir: getDefault('destDir', config.destDir, defaultConfig) as string,
    backupDir: getDefault(
      'backupDir',
      config.backupDir,
      defaultConfig
    ) as string,
    combinedLogsOutputDir: getDefault(
      'combinedLogsOutputDir',
      config.combinedLogsOutputDir,
      defaultConfig
    ) as string,
    errorLogsOutputdir: getDefault(
      'errorLogsOutputdir',
      config.errorLogsOutputdir,
      defaultConfig
    ) as string,
    debounceAmount: getDefault(
      'debounceAmount',
      60000,
      defaultConfig
    ) as number,
    rezAttempts: getDefault('rezAttempts', 3, defaultConfig) as number,
    rezCooldown: getDefault('rezCooldown', 10000, defaultConfig) as number,
    options: { ...defaultEnvConfigOptions, ...config.options },
  }
}

export {
  getCliArg,
  parseCliDirs,
  getLibFromDir,
  defaultEnvConfigOptions,
  EnvConfigValidator,
  parseDefaults,
  RuntimeConfigvalidator,
}
