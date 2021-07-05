import { Widget, WidgetName, WidgetSize } from '@/store/widgets/models'

export interface EnvConfig {
  srcDir: string
  destDir: string
  backupDir: string
  combinedLogsOutputDir: string
  errorLogsOutputdir: string
  debounceAmount: number
  rezAttempts: number
  rezCooldown: number
}

interface LibSyncDirConfig {
  src: string
  dest: string
  backup: string
}

type LibSyncOpts = {
  isDebug: boolean
  runBackUp: boolean
  syncOnStart: boolean
}

export interface RuntimeConfig {
  dirs: LibSyncDirConfig
  libs: LibSyncDirConfig
  options: LibSyncOpts
}

export type WidgetBaseUpdate = {
  isVisible: boolean
  size: WidgetSize
}

export type UpdateWidgetActionPayload = {
  widgetName: WidgetName
  configuration: {
    isVisible: boolean
    widget: Widget
  }
  auxId?: string
}
