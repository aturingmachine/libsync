import { GetterTree } from 'vuex'
import { RootState } from '..'
import {
  Widget,
  WidgetConfig,
  WidgetConfigurationStatus,
  WidgetName,
  WidgetState,
  WidgetStatus,
} from './models'

export enum WidgetGetterTypes {
  HasConfigLoaded = 'HasConfigLoaded',
  IsConfigUpdating = 'IsConfigUpdating',
  GetWidgets = 'GetWidets',
  GetWidget = 'GetWidget',
  GetWidgetStatus = 'GetWidgetStatus',
  GetVisibleWidgets = 'GetVisibleWidgets',
  AnyWidgetUpdating = 'AnyWidgetUpdating',
}

export const widgetGetters: GetterTree<WidgetState, RootState> = {
  [WidgetGetterTypes.HasConfigLoaded]: (state): boolean =>
    [
      WidgetConfigurationStatus.LOADED,
      WidgetConfigurationStatus.UPDATING,
    ].includes(state.status),

  [WidgetGetterTypes.IsConfigUpdating]: (state): boolean =>
    state.status === WidgetConfigurationStatus.UPDATING,

  [WidgetGetterTypes.GetWidgetStatus]: state => (
    widgetName: WidgetName
  ): WidgetStatus | undefined =>
    state.widgets.find(w => w.name === widgetName)?.status,

  [WidgetGetterTypes.GetWidgets]: (state): Widget[] => state.widgets,

  [WidgetGetterTypes.GetVisibleWidgets]: (state): Widget[] =>
    state.visibleWidgets
      .map(visibleWidget =>
        state.widgets.find(
          w =>
            w.name === visibleWidget.name &&
            (visibleWidget.auxId ? w.auxId === visibleWidget.auxId : true)
        )
      )
      .filter(r => r !== undefined) as Widget[],

  [WidgetGetterTypes.GetWidget]: state => (
    widgetName: WidgetName
  ): WidgetConfig | undefined =>
    state.widgets.find(w => w.name === widgetName)?.configuration,

  [WidgetGetterTypes.AnyWidgetUpdating]: (state): boolean =>
    state.widgets.some(w => w.status === WidgetStatus.UPDATING),
}
