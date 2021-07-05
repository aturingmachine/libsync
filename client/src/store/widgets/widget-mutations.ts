import { MutationTree } from 'vuex'
import {
  Widget,
  WidgetConfigurationStatus,
  WidgetState,
  WidgetStatus,
} from './models'

export enum WidgetMutationTypes {
  SetStateLoading = 'SetStateLoading',
  SetStateLoaded = 'SetStateLoaded',
  SetStateError = 'SetStateError',
  SetStateUpdating = 'SetStateUpdating',

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
    state.status = WidgetConfigurationStatus.LOADED
    state.visibleWidgets = [...(payload.visibleWidgets || [])]
    state.widgets = [...payload.widgets]
  },

  [WidgetMutationTypes.SetStateError](state) {
    state.status = WidgetConfigurationStatus.ERROR
  },

  [WidgetMutationTypes.SetStateUpdating](state) {
    state.status = WidgetConfigurationStatus.UPDATING
  },

  /** Widget Status Mutations **/
  [WidgetMutationTypes.SetWidgetRunning](state, payload) {
    const index = state.widgets.findIndex(
      widget =>
        widget.name === payload.widgetName && payload.auxId === widget.auxId
    )

    const update: Widget = {
      ...state.widgets[index],
      status: WidgetStatus.RUNNING,
    }

    const widgetCopy = [...state.widgets]
    widgetCopy.splice(index, 1, update)

    state.widgets = widgetCopy
  },

  [WidgetMutationTypes.SetWidgetUpdating](state, payload) {
    const index = state.widgets.findIndex(
      widget =>
        widget.name === payload.widgetName && payload.auxId === widget.auxId
    )

    const update: Widget = {
      ...state.widgets[index],
      status: WidgetStatus.UPDATING,
    }

    const widgetCopy = [...state.widgets]
    widgetCopy.splice(index, 1, update)

    state.status = WidgetConfigurationStatus.UPDATING
    state.widgets = widgetCopy
  },

  [WidgetMutationTypes.SetWidgetIdle](state, payload) {
    const index = state.widgets.findIndex(
      widget =>
        widget.name === payload.widgetName && payload.auxId === widget.auxId
    )

    const update: Widget = {
      ...state.widgets[index],
      status: WidgetStatus.IDLE,
    }

    const widgetCopy = [...state.widgets]
    widgetCopy.splice(index, 1, update)

    state.widgets = widgetCopy
  },

  /** Widget Configuration Mutations **/
  [WidgetMutationTypes.SetWidgetConfiguration](state, payload) {
    const index = state.widgets.findIndex(
      widget =>
        widget.name === payload.widgetName && payload.auxId === widget.auxId
    )

    const update: Widget = {
      ...state.widgets[index],
      status: state.visibleWidgets.includes({
        name: payload.widgetName,
        auxId: payload.auxId,
      })
        ? WidgetStatus.RUNNING
        : WidgetStatus.IDLE,
      configuration: payload.configuration,
    }

    const widgetCopy = [...state.widgets]
    widgetCopy.splice(index, 1, update)

    state.widgets = widgetCopy
  },
}
