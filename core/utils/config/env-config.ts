import { PathLike } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { EventBinder, EventHandler } from '../event-binder'
import Config from './config-holder'

type EnvConfigStruct = {
  srcDir: string
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
  rezCooldown: number
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
}

const defaultEnvConfig: EnvConfigStruct = {
  srcDir: '',
  destDir: '',
  backupDir: '',
  combinedLogsOutputDir: './logs/combined.log',
  errorLogsOutputdir: './logs/error.log',
  debounceAmount: 60000,
  rezAttempts: 3,
  rezCooldown: 10000,
}

function shouldDefault(val: number | string | undefined): boolean {
  if (typeof val === 'number') {
    return !val
  } else {
    return !val || !val.toString().length
  }
}

function getDefault(key: keyof EnvConfigStruct, val: number | string) {
  return shouldDefault(val) ? defaultEnvConfig[key] : val
}

function parseDefaults(config: EnvConfigStruct): EnvConfigStruct {
  return {
    srcDir: getDefault('srcDir', config.srcDir) as string,
    destDir: getDefault('destDir', config.destDir) as string,
    backupDir: getDefault('backupDir', config.backupDir) as string,
    combinedLogsOutputDir: getDefault(
      'combinedLogsOutputDir',
      config.combinedLogsOutputDir
    ) as string,
    errorLogsOutputdir: getDefault(
      'errorLogsOutputdir',
      config.errorLogsOutputdir
    ) as string,
    debounceAmount: getDefault('debounceAmount', 60000) as number,
    rezAttempts: getDefault('rezAttempts', 3) as number,
    rezCooldown: getDefault('rezCooldown', 10000) as number,
  }
}

class EnvConfig {
  private static _initialConfig: EnvConfigStruct
  private static _config: EnvConfigStruct
  private static eventBinder: EventBinder<EnvConfigStruct>

  static async init(): Promise<void> {
    if (!this.eventBinder) {
      EnvConfig.eventBinder = new EventBinder()
    }

    return fs
      .readFile(path.resolve('./.config.json'), {
        encoding: 'utf-8',
      })
      .then((contents) => {
        const config = JSON.parse(contents) as EnvConfigStruct
        EnvConfig._config = parseDefaults(config)

        if (!EnvConfig._initialConfig) {
          EnvConfig._initialConfig = parseDefaults(config)
        }
      })
  }

  static listen<K extends keyof EnvConfigStruct>(
    properties: K[]
  ): {
    call: (handler: EventHandler<keyof EnvConfigStruct>) => void
  } {
    if (!this.eventBinder) {
      EnvConfig.eventBinder = new EventBinder()
    }

    return this.eventBinder.on(properties)
  }

  static updateConfigFields(changedFields: Partial<EnvConfigStruct>): void {
    Object.keys(changedFields).forEach((key) => {
      const typedKey = key as keyof EnvConfigStruct
      const newValue = changedFields[typedKey]
      if (newValue && EnvConfigValidator[typedKey].valid(newValue)) {
        EnvConfig._update(typedKey, changedFields[typedKey])
        this.eventBinder.triggerUpdate(typedKey, newValue)
      }
      console.log('Should be updated', EnvConfig.get)
    })

    Config.init.dirs()
  }

  static get get(): EnvConfigStruct {
    return { ...defaultEnvConfig, ...EnvConfig._config }
  }

  private static _updateFuncs = {
    srcDir: (val: PathLike): void => EnvConfig._update('srcDir', val),
    destDir: (val: PathLike): void => EnvConfig._update('destDir', val),
    backupDir: (val: PathLike): void => EnvConfig._update('backupDir', val),
    combinedLogsOutputDir: (val: PathLike): void =>
      EnvConfig._update('combinedLogsOutputDir', val),
    errorLogsOutputdir: (val: PathLike): void =>
      EnvConfig._update('errorLogsOutputdir', val),
    debounceAmount: (val: number): void =>
      EnvConfig._update('debounceAmount', val),
    rezAttempts: (val: number): void => EnvConfig._update('rezAttempts', val),
    rezCooldown: (val: number): void => EnvConfig._update('rezCooldown', val),
  }

  private static _update(key: keyof EnvConfigStruct, val: any) {
    EnvConfig._config = {
      ...EnvConfig._config,
      ...{
        [key]: val,
      },
    }
  }
}

export default EnvConfig
