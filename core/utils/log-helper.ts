import chalk from 'chalk'
import winston from 'winston'
import EnvConfig from './config/env-config/env-config'
import { v4 as uuidv4 } from 'uuid'
import LibSync from './config/runtime-config/state'

export type Logger = winston.Logger

const { combine, timestamp, colorize, printf, json, splat } = winston.format

const consoleLogFormat = printf(
  ({ level, message, timestamp, func, service }) => {
    const d = new Date(timestamp)

    const time = d.toLocaleTimeString()
    const spaceIndex = time.indexOf(' ')
    const timeString = time
      .slice(0, spaceIndex)
      .concat(`.${d.getMilliseconds()}`)
      .concat(time.slice(spaceIndex))

    const funcName = `(${func || service})`
    return `[${funcName.padEnd(
      10
    )} :: <${level}> :: ${d.toLocaleDateString()} ${timeString}] ${message}`
  }
)

const id = winston.format((info) => {
  info.id = uuidv4()

  return info
})

export const logger = winston.createLogger({
  level: 'debug',
  format: combine(splat(), timestamp(), id(), json()),
  defaultMeta: { service: 'libsync' },
  transports: [
    new winston.transports.File({
      filename: EnvConfig.get.errorLogsOutputdir,
      level: 'error',
    }),
    new winston.transports.File({
      filename: EnvConfig.get.combinedLogsOutputDir,
    }),
  ],
})

EnvConfig.listen(['errorLogsOutputdir', 'combinedLogsOutputDir']).call(() => {
  // Figure out how to update logs? Might have to restart lol
  return Promise.resolve()
})

export function initLogger(): void {
  // TODO rethink this check for console output, should just check prod flag maybe
  if (!LibSync.options.runOnce || LibSync.options.isDebug) {
    logger.add(
      new winston.transports.Console({
        format: combine(colorize(), timestamp(), splat(), consoleLogFormat),
      })
    )
  }
}

export class LogHelper {
  private static timers: Record<string, number> = {}

  static headboard(
    msg: string,
    color: (...args: any[]) => void = LogHelper.log
  ): void {
    const line = msg
      .split('')
      .map((_) => '*')
      .join('')

    const final = `\n${line}\n${msg}\n${line}\n`

    color(final)
  }

  static start(tag: string): void {
    LogHelper.timers[tag] = Date.now()
  }

  static stop(tag: string): number {
    if (!LogHelper.timers[tag]) {
      throw new Error('Timer Not Started')
    }

    const diff = Date.now() - LogHelper.timers[tag]
    LogHelper.timers[tag] = 0
    return diff
  }

  static log = console.log

  static green(...args: any[]): void {
    LogHelper.log(chalk.green.apply(this, args))
  }

  static yellow(...args: any[]): void {
    LogHelper.log(chalk.yellow.apply(this, args))
  }

  static red(...args: any[]): void {
    LogHelper.log(chalk.red.apply(this, args))
  }

  static Colorize = class {
    static green(msg: string): string {
      return chalk.green(msg)
    }

    static yellow(msg: string): string {
      return chalk.yellow(msg)
    }

    static red(msg: string): string {
      return chalk.red(msg)
    }
  }
}
