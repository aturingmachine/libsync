import { Widget, WidgetName } from '@/store/widgets/models'

export type DasboardServiceWrapper = {
  visibleWidgets: WidgetName[]
  widgets: { [K in keyof typeof WidgetName]?: Exclude<Widget, 'status'> }
}

export class DashboardService {
  static getDashboardConfig(): Promise<DasboardServiceWrapper> {
    return fetch('http://localhost:3000/api/dashboard')
      .then(res => res.json())
      .then(json => json as DasboardServiceWrapper)
  }

  static updateDashboardConfig(
    payload: DasboardServiceWrapper
  ): Promise<DasboardServiceWrapper> {
    return fetch('http://localhost:3000/api/dashboard', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res && res.json())
  }
}
