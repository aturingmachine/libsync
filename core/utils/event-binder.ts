import {
  ConfigurableLibSyncState,
  EnvConfigStruct,
  LibSyncDirConfig,
  LibSyncOpts,
} from './config/models'

type EventHolder<C> = EnvConfigEvents extends C
  ? EnvConfigEvents
  : RuntimeConfigEvents

export type EventHandler<K extends keyof C, C> = (
  param: K,
  newVal: C[K]
) => Promise<any>

type EventDictionary<T> = Record<
  keyof T,
  EventHandler<keyof EventHolder<T>, EventHolder<T>>[]
>

interface EnvConfigEvents extends EnvConfigStruct {
  srcDir: string
  rezCooldown: number
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
  options: LibSyncOpts
}

interface RuntimeConfigEvents extends ConfigurableLibSyncState {
  dirs: LibSyncDirConfig
  libs: LibSyncDirConfig
  options: Pick<LibSyncOpts, 'isDebug' | 'runBackUp' | 'syncOnStart'>
}

export class EventBinder<T> {
  private callbacks!: EventDictionary<T>

  constructor() {
    this.callbacks = {} as EventDictionary<T>
  }

  on<K extends keyof EventHolder<T>>(
    properties: K[],
    thisArg: EventBinder<T> = this
  ): { call: (handler: EventHandler<K, EventHolder<T>>) => void } {
    return function () {
      return {
        call: (handler: EventHandler<K, EventHolder<T>>) => {
          properties.forEach((property) => {
            thisArg.add(property, handler)
          })
        },
      }
    }.bind(this)()
  }

  triggerUpdate<K extends keyof EventHolder<T>>(
    property: K,
    newValue: EventHolder<T>[K]
  ): Promise<any> {
    if (!this.callbacks[property as unknown as keyof T]) {
      this.callbacks[property as unknown as keyof T] = []
    }

    return Promise.all(
      this.callbacks[property as unknown as keyof T].map(
        async (cbFn) => await cbFn(property as keyof EventHolder<T>, newValue)
      )
    )
  }

  private add<K extends keyof EventHolder<T>>(
    property: K,
    handler: EventHandler<K, EventHolder<T>>
  ): void {
    if (!this.callbacks[property as unknown as keyof T]) {
      this.callbacks[property as unknown as keyof T] = []
    }
    this.callbacks[property as unknown as keyof T].push(
      handler as EventHandler<keyof EventHolder<T>, EventHolder<T>>
    )
  }
}
