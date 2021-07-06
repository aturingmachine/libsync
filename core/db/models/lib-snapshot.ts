import { DirStruct } from '../../models/dirs'

export type LibSnapshot = {
  libName: string
  timestamp: number
  path: string
  dirStruct: DirStruct
}

export type LibSnapshotRecord = {
  [libName: string]: LibSnapshot[]
}
