/* eslint-disable @typescript-eslint/no-var-requires*/
const chalk = require('chalk')
const spawn = require('child_process').spawn

const tscTag = chalk.green('[compile]:'.padEnd(10))
const serviceTag = chalk.magentaBright('[service]:')
const clientTag = chalk.cyan('[client]:'.padEnd(10))

const controller = new AbortController()
const { signal } = controller

function relog(tag, data, err) {
  ;`${data}`
    .split('\n')
    .filter((x) => x.length && x !== '\u001Bc')
    .forEach((line) =>
      err ? console.error(`${tag} ${line}`) : console.log(`${tag} ${line}`)
    )
}

console.log(chalk.blue('Starting LibSync dev process...'))
const args = process.argv.slice(2)
console.log(args)
console.log(args.find((x) => x.includes('src=')))

const srcArg = args.find((x) => x.includes('src='))
const destArg = args.find((x) => x.includes('dest='))
const backupArg = args.find((x) => x.includes('backupDir='))
const optsArgs = args.filter((x) => !x.includes('='))

let src = srcArg || 'src=./test-data/test-src-folder'
let dest = destArg || 'dest=./test-data/test-nest-dest/test-dest-folder'
let backup = backupArg || 'backupDir=./test-data/test-backup'

console.log(srcArg, destArg, backupArg)
console.log(src, dest, backup)
console.log(optsArgs)
// process.exit(0)

const clientProcess = spawn(
  'npm',
  ['run', 'serve', '--prefix', './client/libsync-client', '--silent'],
  { signal }
)

clientProcess.stdout.on('data', (data) => {
  relog(clientTag, data)
})

clientProcess.stderr.on('data', (data) => {
  relog(clientTag, data, true)
})

clientProcess.on('exit', (code, sig) => {
  console.log(`${clientTag} EXIT ${code} ${sig}`)
})

const tscProcess = spawn('tsc', ['-w'], { signal })

tscProcess.stdout.on('data', (data) => {
  relog(tscTag, data)
})

tscProcess.stderr.on('data', (data) => {
  relog(tscTag, data, true)
})

tscProcess.on('exit', (code, sig) => {
  console.log(`${tscTag} EXIT ${code} ${sig}`)
})

const serviceProcess = spawn(
  'nodemon',
  ['dist/index.js', 'debug', src, dest, backup, ...optsArgs],
  { signal }
)

serviceProcess.stdout.on('data', (data) => {
  relog(serviceTag, data)
})

serviceProcess.stderr.on('data', (data) => {
  relog(serviceTag, data, true)
})

serviceProcess.on('exit', (code, sig) => {
  console.log(`${serviceTag} EXIT ${code} ${sig}`)
})

function endAll() {
  tscProcess.stdin.pause()
  serviceProcess.stdin.pause()
  clientProcess.stdin.pause()
  controller.abort()
  tscProcess.kill()
  serviceProcess.kill()
  clientProcess.kill()
  process.exit()
}

process.on('SIGTERM', () => {
  console.log(chalk.blue('\nSIGTERM Recieved'))
  endAll()
})

process.on('SIGINT', function () {
  console.log(chalk.blue('\nSIGINT Recieved'))
  endAll()
})

process.on('exit', () => {
  endAll()
})
