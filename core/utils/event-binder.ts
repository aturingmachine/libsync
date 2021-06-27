export type EventHandler<K extends keyof EnvConfigEvents> = (
  param: K,
  newVal: EnvConfigEvents[K]
) => void

type EventDictionary<T> = Record<keyof T, EventHandler<keyof EnvConfigEvents>[]>

interface EnvConfigEvents {
  srcDir: string
  rezCooldown: number
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
}

export class EventBinder<T = unknown> {
  private callbacks!: EventDictionary<T>

  constructor() {
    this.callbacks = {} as EventDictionary<T>
  }

  on<K extends keyof EnvConfigEvents>(
    properties: K[],
    thisArg: EventBinder<T> = this
  ): { call: (handler: EventHandler<K>) => void } {
    return function () {
      return {
        call: (handler: EventHandler<K>) => {
          properties.forEach((property) => {
            thisArg.add(property, handler)
          })
        },
      }
    }.bind(this)()
  }

  triggerUpdate<K extends keyof EnvConfigEvents>(
    property: K,
    newValue: EnvConfigEvents[K]
  ): void {
    this.callbacks[property as keyof EnvConfigEvents as keyof T].forEach(
      (cbFn) => cbFn(property as keyof EnvConfigEvents, newValue)
    )
  }

  private add<K extends keyof EnvConfigEvents>(
    property: K,
    handler: EventHandler<K>
  ): void {
    if (!this.callbacks[property as keyof EnvConfigEvents as keyof T]) {
      this.callbacks[property as keyof EnvConfigEvents as keyof T] = []
    }
    this.callbacks[property as keyof EnvConfigEvents as keyof T].push(
      handler as EventHandler<keyof EnvConfigEvents>
    )
  }
}
