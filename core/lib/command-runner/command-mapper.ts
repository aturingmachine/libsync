import { Command, CommandType, Commands } from '../../models/commands'
import { DirStruct } from '../../models/dirs'
import LibSync from '../../utils/config/runtime-config/state'

const commandSorter = (a: Command, b: Command): number => {
  if (a.type === CommandType.MKDIR && b.type === CommandType.COPY) {
    return -1
  } else if (a.type === CommandType.COPY && b.type === CommandType.MKDIR) {
    return 1
  } else {
    return 0
  }
}

function makeCopyPromises(fullPathNames: string[]): Command[] {
  const dirsToMake: string[] = []

  return fullPathNames
    .map((fullPathName) => {
      let target: DirStruct = LibSync.to.dirStruct[LibSync.to.lib]?.contents
      let src: DirStruct = LibSync.from.dirStruct[LibSync.from.lib].contents
      const poppedPathName = fullPathName.split('/').filter((x) => x.length)

      return poppedPathName.map((pathPiece, index): Command | undefined => {
        let result

        const x = '/'.concat(
          poppedPathName.filter((y, i) => i <= index).join('/')
        )

        const fName = `${LibSync.to.dir}${x}`

        if (!src && !target) {
          return
        }

        try {
          if (src[pathPiece]?.isDir) {
            if (
              !dirsToMake.includes(fName) &&
              (!target || !target[pathPiece])
            ) {
              dirsToMake.push(fName)
              result = { type: CommandType.MKDIR, text: `${fName}` }
            }
          } else {
            result = {
              type: CommandType.COPY,
              text: [
                `${LibSync.from.dir}${fullPathName}`,
                `${LibSync.to.dir}${fullPathName}`,
              ],
            }
          }

          src = src[pathPiece]?.contents
          target = target?.[pathPiece]?.contents

          return result
        } catch (error) {
          console.error('Failed To Create Command', error)
          console.table({
            pathPiece,
            fullPathName,
            index,
          })
        }
      })
    })
    .flat()
    .filter((x) => x !== undefined) as Command[]
}

function buildCommands(fullPathNames: string[]): Commands {
  const commands = makeCopyPromises(fullPathNames)

  const sortedCommands = commands.sort(commandSorter)

  const mkdirCommands = sortedCommands.filter(
    (comm) => comm.type === CommandType.MKDIR
  )

  const copyCommands = sortedCommands.filter(
    (comm) => comm.type === CommandType.COPY
  )

  return {
    mkdir: mkdirCommands,
    copy: copyCommands,
  }
}

export default buildCommands
