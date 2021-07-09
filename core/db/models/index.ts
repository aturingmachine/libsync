import { LibSnapshotRecord } from './lib-snapshot.js'

export type LibSyncDatabaseSchema = {
  libSnapshots: LibSnapshotRecord
}

export const DBInit: LibSyncDatabaseSchema = {
  libSnapshots: {},
}
