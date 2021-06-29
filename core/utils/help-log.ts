import { getOptsFlags, optsFlags } from './config/models'
import { LogHelper } from './log-helper'

function getSpacer(): string {
  return ' '.padStart(22, ' ')
}

interface HelpGuide {
  [key: string]: { type: string[]; helpMsg: string }
}

const argsFlags: HelpGuide = {
  'src=': {
    type: ['PathLike'],
    helpMsg:
      'The path that should be used as the source of truth. This should be the directory that you want watched.',
  },
  'dest=': {
    type: ['PathLike'],
    helpMsg: 'Where LibSync should copy new files in "src" to.',
  },
  'backupDir=': {
    type: ['PathLike'],
    helpMsg:
      'When used with the -(b)ackup option, LibSync will sync the contents of "dest" into this directory before each sync is made.',
  },
}
Object.freeze(argsFlags)

const configGuide: HelpGuide = {
  srcDir: {
    type: ['PathLike'],
    helpMsg: `Equivalent of the "src=" argument.\n${getSpacer()}${LogHelper.Colorize.red(
      'Will be overridden by the "src=" argument.'
    )}`,
  },
  destDir: {
    type: ['PathLike'],
    helpMsg: `Equivalent of the "dest=" argument.\n${getSpacer()}${LogHelper.Colorize.red(
      'Will be overridden by the "dest=" argument.'
    )}`,
  },
  backupDir: {
    type: ['PathLike'],
    helpMsg: `Equivalent of the "backupDir=" argument.\n${getSpacer()}${LogHelper.Colorize.red(
      'Will be overridden by the "backupDir=" argument.'
    )}`,
  },
  combinedLogsOutputDir: {
    type: ['PathLike'],
    helpMsg: `Where all logs should be written.\n${getSpacer()}${LogHelper.Colorize.yellow(
      'Defaults to "./logs/combined.log"'
    )}`,
  },
  errorLogsOutputdir: {
    type: ['PathLike'],
    helpMsg: `Where error logs should be written.\n${getSpacer()}${LogHelper.Colorize.yellow(
      'Defaults to "./logs/error.log"'
    )}`,
  },
  debounceAmount: {
    type: ['number', 'ms'],
    helpMsg: `How long LibSync should wait between change events before attempting the sync process. Not recommended to set below 20000.\n${getSpacer()}${LogHelper.Colorize.yellow(
      'Defaults to 60000'
    )}`,
  },
  rezAttempts: {
    type: ['number', 'ms'],
    helpMsg: `How many attempts should be made to remount the service if it detaches from the src dir. Will not recover from fatal errors.\n${getSpacer()}${LogHelper.Colorize.yellow(
      'Defaults to 3'
    )}`,
  },
  rezCooldown: {
    type: ['number', 'ms'],
    helpMsg: `How long to wait before making a rez attempt. Wait will also occur before first rez attempt.\n${getSpacer()}${LogHelper.Colorize.yellow(
      'Defaults to 10000'
    )}`,
  },
}

let line: string

function logOptions() {
  LogHelper.headboard('LibSync Options', LogHelper.green)
  console.group()
  const optFlags = optsFlags

  const optionsMessages = Object.keys(optFlags).map((flag) => {
    const flags = optFlags[flag].flags.join(', ')
    return `\n${flag})\n  ${flags.padEnd(17, ' ')} - ${optFlags[flag].helpMsg}`
  })

  line = Array(
    optionsMessages.reduce((prev, curr) => {
      return prev > curr.length ? prev : curr.length
    }, 0)
  ).join('_')

  console.log(line)
  optionsMessages.forEach((msg) => {
    console.log(msg)
    console.log(line)
  })
  console.groupEnd()
}

function logArguments() {
  console.log('\n')
  LogHelper.headboard('LibSync Arguments', LogHelper.green)
  console.group()
  const argsMessages = Object.keys(argsFlags).map((arg) => {
    const type = argsFlags[arg].type.join('')
    return `\n${arg})\n  ${type.padEnd(17, ' ')} - ${argsFlags[arg].helpMsg}`
  })

  console.log(line)
  argsMessages.forEach((msg) => {
    console.log(msg)
    console.log(line)
  })

  console.groupEnd()
}

function logConfig() {
  console.log('\n')
  LogHelper.headboard('LibSync Configuration', LogHelper.green)
  console.log(
    "LibSync's Behavior can be modified by changing some environment variables. These are read automatically from a local './.config.json'. A template can be found at './.config.example.json'."
  )

  console.group()

  const confMessages = Object.keys(configGuide).map((conf) => {
    const type = configGuide[conf].type.join(', ')
    return `\n${conf})\n  ${type.padEnd(17, ' ')} - ${
      configGuide[conf].helpMsg
    }`
  })

  console.log(line)
  confMessages.forEach((msg) => {
    console.log(msg)
    console.log(line)
  })

  console.groupEnd()
}

export function logHelpMessage() {
  LogHelper.headboard('LibSync Help'.padStart(24).padEnd(36), LogHelper.green)
  console.log(
    'Welcome to LibSync, a piece of software I built out of laziness and boredom.\n'
  )
  console.log(
    'LibSync exists to solve a very simple problem with an overly complex solution.\n' +
      'My iTunes downloads music into one directory, while my Plex server reads from another. And I would rather they not know of each other.\n' +
      'In order to keep them in sync LibSync was born.\n'
  )

  console.log(
    'LibSync can be run as either a one of syncing process or set up to\n' +
      'watch a source directory for changes before syncing those to the destination.\n' +
      'Either option performs practically the same process and can be configured with some\n' +
      'options as well as command line arguments.\n\n'
  )

  logOptions()

  logArguments()

  logConfig()

  process.exit(0)
}
