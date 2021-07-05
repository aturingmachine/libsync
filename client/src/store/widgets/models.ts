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
  customOptions?: Record<string, string | number | boolean | string[]>
}

export type Widget = {
  name: WidgetName
  status: WidgetStatus
  configuration: WidgetConfig
  auxId?: string
}

export type WidgetRecords = {
  [K in keyof typeof WidgetName]?: Widget
}

export interface WidgetState {
  status: WidgetConfigurationStatus
  visibleWidgets: WidgetId[]
  widgets: Widget[]
}

export type WidgetId = {
  name: WidgetName
  auxId?: string
}

export const findWidget = (
  widgets: Widget[],
  widgetName: WidgetName,
  auxId?: string
): { index: number; widget?: Widget } => {
  let target: Widget | undefined
  let index: number

  if (auxId) {
    target = widgets.find(w => w.auxId?.includes(auxId))
    index = widgets.findIndex(w => w.auxId?.includes(auxId))

    if (target) {
      return {
        index,
        widget: target,
      }
    }
  }

  target = widgets.find(w => w.name === widgetName)
  index = widgets.findIndex(w => w.name === widgetName)

  return {
    index,
    widget: target,
  }
}
