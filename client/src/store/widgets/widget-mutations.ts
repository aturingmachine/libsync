import { MutationTree } from 'vuex'
import {
  WidgetConfigurationStatus,
  WidgetName,
  WidgetState,
  WidgetStatus,
} from './models'

export enum WidgetMutationTypes {
  SetStateLoading = 'SetStateLoading',
  SetStateLoaded = 'SetStateLoaded',
  SetStateError = 'SetStateError',

  SetWidgetRunning = 'SetWidgetRunning',
  SetWidgetUpdating = 'SetWidgetUpdating',
  SetWidgetIdle = 'SetWidgetIdle',

  SetWidgetConfiguration = 'SetWidgetConfiguration',
}

export const widgetMutations: MutationTree<WidgetState> = {
  /** Widget State Status Mutations **/
  [WidgetMutationTypes.SetStateLoading](state) {
    state.status = WidgetConfigurationStatus.LOADING
  },

  [WidgetMutationTypes.SetStateLoaded](state, payload) {
    console.log(payload)
    state.status = WidgetConfigurationStatus.LOADED
    state.visibleWidget = [...(payload.visibleWidgets || [])]
    state.widgets = { ...payload.widgets }
  },

  [WidgetMutationTypes.SetStateError](state) {
    state.status = WidgetConfigurationStatus.ERROR
  },

  /** Widget Status Mutations **/
  [WidgetMutationTypes.SetWidgetRunning](state, payload) {
    state.widgets = {
      ...state.widgets,
      [payload.widgetName]: {
        ...state.widgets[payload.widgetName as WidgetName],
        status: WidgetStatus.RUNNING,
      },
    }
  },

  [WidgetMutationTypes.SetWidgetUpdating](state, payload) {
    state.widgets = {
      ...state.widgets,
      [payload.widgetName]: {
        ...state.widgets[payload.widgetName as WidgetName],
        status: WidgetStatus.UPDATING,
      },
    }
  },

  [WidgetMutationTypes.SetWidgetIdle](state, payload) {
    state.widgets = {
      ...state.widgets,
      [payload.widgetName]: {
        ...state.widgets[payload.widgetName as WidgetName],
        status: WidgetStatus.IDLE,
      },
    }
  },

  /** Widget Configuration Mutations **/
  [WidgetMutationTypes.SetWidgetConfiguration](state, payload) {
    state.widgets = {
      ...state.widgets,
      [payload.widgetName]: {
        ...state.widgets[payload.widgetName as WidgetName],
        status: state.visibleWidget.includes(payload.widgetName)
          ? WidgetStatus.RUNNING
          : WidgetStatus.IDLE,
        configuration: payload.configuration,
      },
    }
  },
}
