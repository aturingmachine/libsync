export interface DirStruct {
  [key: string]: DirStructInside
}

export interface DirStructInside {
  fullRelativePath: string
  isDir: boolean
  contents: DirStruct
}

export enum TargetName {
  Source = 'Source',
  Target = 'Target',
  Backup = 'Backup',
}
