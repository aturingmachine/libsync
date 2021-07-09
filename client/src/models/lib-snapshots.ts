export interface DirStruct {
  [key: string]: DirStructInside
}

export interface DirStructInside {
  fullRelativePath: string
  isDir: boolean
  contents: DirStruct
}

export type RunDetails = {
  source: string
  destination: string
  backup: string
}

export type LibSnapshot = {
  libName: string
  run: RunDetails
  timestamp: number
  path: string
  dirStruct: DirStruct
}

export type LibSnapshotRecord = {
  [libName: string]: LibSnapshot[]
}
