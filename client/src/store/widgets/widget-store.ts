import { Module } from 'vuex'
import { RootState } from '..'
import { namespaceModule } from '../utils/module-helpers'
import { WidgetConfigurationStatus, WidgetState } from './models'
import { widgetActions, WidgetActionTypes } from './widget-actions'
import { widgetGetters, WidgetGetterTypes } from './widget-getters'
import { widgetMutations, WidgetMutationTypes } from './widget-mutations'

export const widgetState = (): WidgetState => ({
  status: WidgetConfigurationStatus.UNLOADED,
  visibleWidgets: [],
  widgets: [],
})

export const WidgetStoreTypes = namespaceModule(
  'widgets',
  WidgetGetterTypes,
  WidgetMutationTypes,
  WidgetActionTypes
)

export const widgetsModule: Module<WidgetState, RootState> = {
  namespaced: true,
  state: widgetState,
  getters: widgetGetters,
  mutations: widgetMutations,
  actions: widgetActions,
}
