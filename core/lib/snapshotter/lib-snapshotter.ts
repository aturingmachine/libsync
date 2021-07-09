import { LibSyncDatabase } from '../../db/index.js'
import { RunDetails } from '../../db/models/lib-snapshot.js'
import LibSync from '../../utils/config/runtime-config/state.js'
import { logger, Logger } from '../../utils/log-helper.js'

export class LibSnapshotter {
  private static log: Logger

  static takeSnapshots(): void {
    LibSnapshotter.log ||= logger.child({ func: 'snapshot' })

    LibSnapshotter.log.info('Capturing Library Snapshots')
    LibSnapshotter.captureFrom()
    LibSnapshotter.captureTo()
    LibSnapshotter.captureBackup()
    LibSnapshotter.log.info('Snapshots Captured')
  }

  private static get libConfig(): RunDetails {
    return {
      source: LibSync.from.dir as string,
      destination: LibSync.to.dir as string,
      backup: LibSync.backupTarget.dir as string,
    }
  }

  private static captureFrom(): void {
    LibSyncDatabase.writeLibSnapshot({
      libName: LibSync.from.lib,
      run: LibSnapshotter.libConfig,
      timestamp: Date.now(),
      path: LibSync.from.dir as string,
      dirStruct: LibSync.from.dirStruct,
    })
  }

  private static captureTo(): void {
    LibSyncDatabase.writeLibSnapshot({
      libName: LibSync.to.lib,
      run: LibSnapshotter.libConfig,
      timestamp: Date.now(),
      path: LibSync.to.dir as string,
      dirStruct: LibSync.to.dirStruct,
    })
  }

  private static captureBackup(): void {
    LibSyncDatabase.writeLibSnapshot({
      libName: LibSync.backupTarget.lib,
      run: LibSnapshotter.libConfig,
      timestamp: Date.now(),
      path: LibSync.backupTarget.dir as string,
      dirStruct: LibSync.backupTarget.dirStruct,
    })
  }
}
