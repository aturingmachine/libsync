export enum CommandType {
  MKDIR = 'MKDIR',
  COPY = 'COPY',
}

export interface Command {
  type: CommandType
  text: string | string[]
}

export interface Commands {
  mkdir: Command[]
  copy: Command[]
}
