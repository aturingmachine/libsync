import { Low, JSONFile } from 'lowdb'
import path from 'path'
import { logger, Logger } from '../utils/log-helper'
import { DBInit, LibSyncDatabaseSchema } from './models'
import { LibSnapshot, LibSnapshotRecord } from './models/lib-snapshot'

export class LibSyncDatabase {
  private static logger: Logger
  private static file = path.resolve(__dirname, './db.json')
  private static adapter: JSONFile<LibSyncDatabaseSchema>
  private static connection: Low<LibSyncDatabaseSchema>

  static init(): void {
    if (!LibSyncDatabase.connection?.data) {
      LibSyncDatabase.logger = logger.child({ func: 'db' })

      LibSyncDatabase.logger.info('Initializing Database')
      LibSyncDatabase.adapter = new JSONFile(LibSyncDatabase.file)
      LibSyncDatabase.connection = new Low(LibSyncDatabase.adapter)

      LibSyncDatabase.establishConnection()
      LibSyncDatabase.logger.info('Connection Established')

      LibSyncDatabase.connection.data ||= DBInit
    }
  }

  /**
   * Read Methods
   */
  static get libSnapshots(): LibSnapshotRecord | undefined {
    return LibSyncDatabase.connection.data?.libSnapshots
  }

  /**
   * Write Methods
   */
  static async writeLibSnapshot(snapshot: LibSnapshot): Promise<void> {
    if (LibSyncDatabase.connection.data?.libSnapshots[snapshot.libName]) {
      const existingRecord =
        LibSyncDatabase.connection.data.libSnapshots[snapshot.libName]

      existingRecord.push(snapshot)
    } else if (LibSyncDatabase.connection.data?.libSnapshots) {
      LibSyncDatabase.connection.data.libSnapshots[snapshot.libName] = [
        snapshot,
      ]
    }

    await LibSyncDatabase.connection.write()
  }

  /**
   * Private Methods
   */
  private static async establishConnection(): Promise<void> {
    LibSyncDatabase.logger.info('Establishing Connection')
    await LibSyncDatabase.connection.read()
  }
}
