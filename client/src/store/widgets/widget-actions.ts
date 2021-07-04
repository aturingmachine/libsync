import { UpdateWidgetActionPayload } from '@/models/config'
import {
  DasboardServiceWrapper,
  DashboardService,
} from '@/services/dashboard-service'
import { ActionTree } from 'vuex'
import { RootState } from '..'
import { WidgetConfigurationStatus, WidgetState, WidgetStatus } from './models'
import { WidgetMutationTypes } from './widget-mutations'

export enum WidgetActionTypes {
  GetWidgetConfigurations = 'GetWidgetConfigurations',
  UpdateWidgetConfiguration = 'UpdateWidgetConfiguration',
}

export const widgetActions: ActionTree<WidgetState, RootState> = {
  [WidgetActionTypes.GetWidgetConfigurations]: ({ commit, state }) => {
    if (state.status === WidgetConfigurationStatus.LOADED) {
      return
    }

    commit({ type: WidgetMutationTypes.SetStateLoading })

    DashboardService.getDashboardConfig()
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

  [WidgetActionTypes.UpdateWidgetConfiguration]: (
    { commit, state },
    payload: UpdateWidgetActionPayload
  ) => {
    if (
      state.status !== WidgetConfigurationStatus.LOADED ||
      state.widgets[payload.widgetName]?.status === WidgetStatus.UPDATING
    ) {
      return
    }

    commit({
      type: WidgetMutationTypes.SetWidgetUpdating,
      widgetName: payload.widgetName,
    })

    const visibleWidgets = payload.configuration.isVisible
      ? Array.of(...new Set([...state.visibleWidget, payload.widgetName]))
      : [
          ...state.visibleWidget.slice(
            state.visibleWidget.indexOf(payload.widgetName),
            1
          ),
        ]

    const requestPayload: DasboardServiceWrapper = {
      visibleWidgets,
      widgets: {
        ...state.widgets,
        [payload.widgetName]: { ...payload.configuration.widget },
      },
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
