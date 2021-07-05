import {
  Widget,
  WidgetName,
  WidgetSize,
  WidgetStatus,
} from '@/store/widgets/models'

export interface WidgetOrdering {
  index: number
  widget: Widget
}

const lockStatusWidget: Widget = {
  name: WidgetName.LockStatusWidget,
  status: WidgetStatus.IDLE,
  configuration: {
    size: WidgetSize.Medium,
    customOptions: {
      pollingPeriod: 3000,
      showTimeline: true,
    },
  },
}

const cpuProcessStatsWidget: Widget = {
  name: WidgetName.ProcessStatsWidget,
  status: WidgetStatus.IDLE,
  auxId: 'cpu',
  configuration: {
    size: WidgetSize.Medium,
  },
}

const memProcessStatsWidget: Widget = {
  name: WidgetName.ProcessStatsWidget,
  status: WidgetStatus.IDLE,
  auxId: 'mem',
  configuration: {
    size: WidgetSize.Medium,
  },
}

export const definedWidgets = [
  lockStatusWidget,
  cpuProcessStatsWidget,
  memProcessStatsWidget,
]
