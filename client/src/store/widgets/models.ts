export enum WidgetConfigurationStatus {
  UNLOADED = 'UNLOADED',
  LOADED = 'LOADED',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

export enum WidgetStatus {
  RUNNING = 'RUNNING',
  UPDATING = 'UPDATING',
  IDLE = 'IDLE',
}

export enum WidgetName {
  LockStatusWidget = 'LockStatusWidget',
  ProcessStatsWidget = 'ProcessStatsWidget',
}

export enum WidgetSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  XLarge = 'XLarge',
}

export type WidgetConfig = {
  size: WidgetSize
  customOptions: Record<string, string | number | boolean | string[]>
}

export type Widget = {
  name: WidgetName
  status: WidgetStatus
  configuration: WidgetConfig
}

export type WidgetRecords = {
  [K in keyof typeof WidgetName]?: Widget
}

export interface WidgetState {
  status: WidgetConfigurationStatus
  visibleWidget: WidgetName[]
  widgets: WidgetRecords
}
