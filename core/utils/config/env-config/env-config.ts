import { PathLike } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { EventBinder, EventHandler } from '../../event-binder'
import {
  defaultEnvConfigOptions,
  EnvConfigValidator,
  parseDefaults,
} from '../config-utils'
import { EnvConfigStruct } from '../models'

const defaultEnvConfig: EnvConfigStruct = {
  srcDir: '',
  destDir: '',
  backupDir: '',
  combinedLogsOutputDir: './logs/combined.log',
  errorLogsOutputdir: './logs/error.log',
  debounceAmount: 60000,
  rezAttempts: 3,
  rezCooldown: 10000,
  options: defaultEnvConfigOptions,
}

/**
 * EnvConfig
 *
 * Used to hold the current parsed .config.json. This configuration is
 * considered static, and can be overrided by parsed command line arguments.
 */
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
        EnvConfig._config = parseDefaults(config, defaultEnvConfig)

        if (!EnvConfig._initialConfig) {
          EnvConfig._initialConfig = parseDefaults(config, defaultEnvConfig)
        }
      })
  }

  static listen<K extends keyof EnvConfigStruct>(
    properties: K[]
  ): {
    call: (
      handler: EventHandler<keyof EnvConfigStruct, EnvConfigStruct>
    ) => void
  } {
    if (!this.eventBinder) {
      EnvConfig.eventBinder = new EventBinder()
    }

    return this.eventBinder.on(properties)
  }

  static updateConfigFields(
    changedFields: Partial<EnvConfigStruct>
  ): Promise<any> {
    return Promise.all(
      Object.keys(changedFields).map(async (key) => {
        const typedKey = key as keyof EnvConfigStruct
        const newValue = changedFields[typedKey]
        if (newValue && EnvConfigValidator[typedKey].valid(newValue)) {
          EnvConfig._update(typedKey, changedFields[typedKey])
          console.log('updating field', typedKey)
          await this.eventBinder.triggerUpdate(typedKey, newValue)
          console.log('update done')
        }
      })
    )
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
