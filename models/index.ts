export interface DirStruct {
  [key: string]: DirStructInside
}

export interface DirStructInside {
  fullRelativePath: string
  isDir: boolean
  contents: DirStruct
}

export enum CommandType {
  MKDIR = 'MKDIR',
  COPY = 'COPY',
}

export interface Command {
  type: CommandType
  text: string | string[]
}

export enum TargetName {
  Source = 'Source',
  Target = 'Target',
  Backup = 'Backup',
}

export interface Commands {
  mkdir: Command[]
  copy: Command[]
}
