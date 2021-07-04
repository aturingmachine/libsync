export interface Log {
  func: string
  service: string
  level: string
  message: string
  timestamps: string
  [key: string]: unknown
}
