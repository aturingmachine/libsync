import { UpdateWidgetActionPayload } from '@/models/config'
import { definedWidgets, WidgetOrdering } from '@/models/widgets'
import {
  DasboardServiceWrapper,
  DashboardService,
} from '@/services/dashboard-service'
import { ActionTree } from 'vuex'
import { RootState } from '..'
import {
  findWidget,
  Widget,
  WidgetConfigurationStatus,
  WidgetId,
  WidgetState,
  WidgetStatus,
} from './models'
import { WidgetMutationTypes } from './widget-mutations'

export enum WidgetActionTypes {
  GetWidgetConfigurations = 'GetWidgetConfigurations',
  UpdateWidgetConfiguration = 'UpdateWidgetConfiguration',
  UpdateWidgetOrder = 'UpdateWidgetOrder',
  UpdateVisibleWidgets = 'UpdateVisibleWidgets',
}

export const widgetActions: ActionTree<WidgetState, RootState> = {
  [WidgetActionTypes.GetWidgetConfigurations]: ({ commit, state }) => {
    if (state.status === WidgetConfigurationStatus.LOADED) {
      return
    }

    commit({ type: WidgetMutationTypes.SetStateLoading })

    DashboardService.getDashboardConfig()
      .then(response => {
        const newWidgetConfigs: Widget[] = definedWidgets.filter(
          definedWidgetId => {
            return (
              response.widgets.findIndex(
                widget =>
                  widget.name === definedWidgetId.name &&
                  widget.auxId === definedWidgetId.auxId
              ) === -1
            )
          }
        )

        if (newWidgetConfigs.length > 0) {
          commit({
            type: WidgetMutationTypes.SetStateLoaded,
            visibleWidgets: response.visibleWidgets,
            widgets: [...response.widgets, ...newWidgetConfigs],
          })
        }

        if (newWidgetConfigs.length === 0) {
          commit({
            type: WidgetMutationTypes.SetStateLoaded,
            visibleWidgets: response.visibleWidgets,
            widgets: response.widgets,
          })
        }
      })
      .catch(err => {
        console.error(err)
        commit({ type: WidgetMutationTypes.SetStateError })
      })
  },

  [WidgetActionTypes.UpdateWidgetConfiguration]: (
    { commit, state },
    payload: UpdateWidgetActionPayload
  ) => {
    const { widget, index } = findWidget(
      state.widgets,
      payload.widgetName,
      payload.auxId
    )

    if (
      state.status !== WidgetConfigurationStatus.LOADED ||
      widget?.status === WidgetStatus.UPDATING
    ) {
      return
    }

    commit({
      type: WidgetMutationTypes.SetWidgetUpdating,
      widgetName: payload.widgetName,
      auxId: payload.auxId,
    })

    const visibleWidgetCopy = [...state.visibleWidgets]
    let visibleWidgets: WidgetId[]

    if (payload.configuration.isVisible) {
      visibleWidgets = visibleWidgetCopy.filter(
        (v, index) => visibleWidgetCopy.indexOf(v, index + 1) === -1
      )
    } else {
      const targetIndex = visibleWidgetCopy.findIndex(
        v => v.name === payload.widgetName && v.auxId === payload.auxId
      )

      visibleWidgets = [
        ...visibleWidgetCopy.slice(0, targetIndex),
        ...visibleWidgetCopy.slice(targetIndex + 1),
      ]
    }

    const update: Widget = {
      ...state.widgets[index],
      status: payload.configuration.isVisible
        ? WidgetStatus.RUNNING
        : WidgetStatus.IDLE,
      configuration: {
        ...state.widgets[index].configuration,
        ...payload.configuration.widget.configuration,
      },
    }

    const widgetCopy = [...state.widgets]
    widgetCopy.splice(index, 1, update)

    const requestPayload: DasboardServiceWrapper = {
      visibleWidgets,
      widgets: widgetCopy,
    }

    return DashboardService.updateDashboardConfig(requestPayload)
      .then(response => {
        commit({
          type: WidgetMutationTypes.SetStateLoaded,
          visibleWidgets: response.visibleWidgets,
          widgets: response.widgets,
        })
      })
      .catch(err => {
        console.error(err)
        commit({ type: WidgetMutationTypes.SetStateError })
      })
  },

  [WidgetActionTypes.UpdateWidgetOrder]: (
    { commit, state },
    payload: { orderedWidgets: WidgetOrdering[] }
  ) => {
    if (
      [
        WidgetConfigurationStatus.LOADING,
        WidgetConfigurationStatus.UPDATING,
      ].includes(state.status)
    ) {
      return
    }

    commit({ type: WidgetMutationTypes.SetStateUpdating })

    const requestPayload: DasboardServiceWrapper = {
      visibleWidgets: state.visibleWidgets,
      widgets: payload.orderedWidgets.map(w => w.widget),
    }

    return DashboardService.updateDashboardConfig(requestPayload)
      .then(response => {
        commit({
          type: WidgetMutationTypes.SetStateLoaded,
          visibleWidgets: response.visibleWidgets,
          widgets: response.widgets,
        })
      })
      .catch(err => {
        console.error(err)
        commit({ type: WidgetMutationTypes.SetStateError })
      })
  },

  [WidgetActionTypes.UpdateVisibleWidgets]: (
    { commit, state },
    payload: { visibleWidgets: Widget[] }
  ) => {
    if (
      [
        WidgetConfigurationStatus.LOADING,
        WidgetConfigurationStatus.UPDATING,
      ].includes(state.status)
    ) {
      return
    }

    commit({ type: WidgetMutationTypes.SetStateUpdating })

    const requestPayload: DasboardServiceWrapper = {
      visibleWidgets: payload.visibleWidgets.map(w => ({
        name: w.name,
        auxId: w.auxId,
      })),
      widgets: state.widgets,
    }

    return DashboardService.updateDashboardConfig(requestPayload)
      .then(response => {
        commit({
          type: WidgetMutationTypes.SetStateLoaded,
          visibleWidgets: response.visibleWidgets,
          widgets: response.widgets,
        })
      })
      .catch(err => {
        console.error(err)
        commit({ type: WidgetMutationTypes.SetStateError })
      })
  },
}
