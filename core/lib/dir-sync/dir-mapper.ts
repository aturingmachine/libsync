import { Dirent, PathLike } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { DirStruct, TargetName } from '../../models/dirs'
import { Logger, logger, LogHelper } from '../../utils/log-helper'
import LibSync from '../../utils/state/state'

let dirMapLogger: Logger

async function recursiveDirTraverse(
  entry: Dirent,
  pathName: PathLike,
  targetTree: TargetName,
  isRootAndEmpty: boolean
): Promise<void> {
  const wrappedEntry = isRootAndEmpty
    ? { name: '', isDirectory: () => true }
    : entry

  const newPath = path.join(pathName.toString(), wrappedEntry.name)

  let targetMem: DirStruct
  let currentRelativePath = ''
  let hasSetRoot = false

  newPath.split('/').forEach((x, index) => {
    const libName =
      targetTree === LibSync.from.name ? LibSync.from.lib : LibSync.to.lib

    if (x !== libName && !hasSetRoot) {
      return
    }
    hasSetRoot = true
    currentRelativePath = index === 0 ? 'root' : newPath
    if (!targetMem) {
      targetMem = targetTree === TargetName.Source ? LibSync.src : LibSync.dest
    }

    const existing = targetMem[x]
    if (existing) {
      targetMem = existing.contents
    } else {
      targetMem[x] = {
        fullRelativePath: currentRelativePath,
        isDir: wrappedEntry.isDirectory(),
        contents: {},
      }
      targetMem = targetMem[x].contents
    }
  })

  if (wrappedEntry.isDirectory()) {
    const subEntries = await fs.readdir(newPath, { withFileTypes: true })

    await Promise.all(
      subEntries.map(
        async (entry) =>
          await recursiveDirTraverse(entry, newPath, targetTree, false)
      )
    )
  }
}

async function mapDirectoryStructure(
  path: PathLike,
  target: TargetName
): Promise<void> {
  dirMapLogger = logger.child({ func: 'dir-mapper' })

  dirMapLogger.info(`Mapping ${target} Directory Structure at ${path}`)
  LogHelper.start(`map-${target}`)
  const sourceEntries = await fs.readdir(path, { withFileTypes: true })

  try {
    if (sourceEntries.length === 0) {
      await recursiveDirTraverse(
        undefined as unknown as Dirent,
        path,
        target,
        true
      )
    } else {
      for (const entry of sourceEntries) {
        await recursiveDirTraverse(entry, path, target, false)
      }
    }

    dirMapLogger.info(
      `${target} Directory Structure Mapped in ${LogHelper.stop(
        `map-${target}`
      )}ms.`
    )
  } catch (error) {
    console.error(error)
  }
}

declare type TraversalEntry = { relativePath: string; entry: Dirent }

async function nonRecursiveDirTraversal(
  root: string
): Promise<{ files: TraversalEntry[]; directories: TraversalEntry[] }> {
  const rootDir = await fs.opendir(root)

  const directories: TraversalEntry[] = []
  const files: TraversalEntry[] = []
  const queued: TraversalEntry[] = []

  for await (const entry of rootDir) {
    queued.push({ relativePath: '', entry })
  }

  while (queued.length !== 0) {
    const curr = queued.shift() as TraversalEntry
    if (curr.entry.isDirectory()) {
      directories.push(curr)
      const entries = await fs.readdir(
        path.join(root, curr.relativePath, curr.entry.name),
        { withFileTypes: true }
      )
      for (const entry of entries) {
        queued.push({
          relativePath: path.join(curr.relativePath, curr.entry.name),
          entry,
        })
      }
    } else {
      files.push(curr)
    }
  }

  return { files, directories }
}

export default mapDirectoryStructure
