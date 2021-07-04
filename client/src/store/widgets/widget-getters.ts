import { GetterTree } from 'vuex'
import { RootState } from '..'
import {
  Widget,
  WidgetConfig,
  WidgetConfigurationStatus,
  WidgetName,
  WidgetRecords,
  WidgetState,
  WidgetStatus,
} from './models'

export enum WidgetGetterTypes {
  HasConfigLoaded = 'HasConfigLoaded',
  GetWidgets = 'GetWidets',
  GetWidget = 'GetWidget',
  GetWidgetStatus = 'GetWidgetStatus',
  GetVisibleWidgets = 'GetVisibleWidgets',
}

export const widgetGetters: GetterTree<WidgetState, RootState> = {
  [WidgetGetterTypes.HasConfigLoaded]: (state): boolean =>
    state.status === WidgetConfigurationStatus.LOADED,

  [WidgetGetterTypes.GetWidgetStatus]: state => (
    widgetName: WidgetName
  ): WidgetStatus | undefined => state.widgets[widgetName]?.status,

  [WidgetGetterTypes.GetWidgets]: (state): WidgetRecords => state.widgets,

  [WidgetGetterTypes.GetVisibleWidgets]: (state): Widget[] =>
    state.visibleWidget
      .map(widgetName => state.widgets[widgetName])
      .filter(r => r !== undefined) as Widget[],

  [WidgetGetterTypes.GetWidget]: state => (
    widgetName: WidgetName
  ): WidgetConfig | undefined => state.widgets[widgetName]?.configuration,
}
