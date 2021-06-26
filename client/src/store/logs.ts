import { Log } from '@/models/logs'
import { LogsService } from '@/services/logs-service'
import { LogsWebSocket } from '@/services/websocket'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '.'

export enum LogsGetters {
  GetLogs = 'logs/getLogs',
}

export enum LogsMutations {
  AddLogs = 'logs/addLogs',
}

export interface LogsState {
  logs: Log[]
  hasInitialized: boolean
}

export const logsState = (): LogsState => ({ logs: [], hasInitialized: false })

export const logsGetters: GetterTree<LogsState, RootState> = {
  getLogs: (state): Log[] => state.logs,
}

export const logsMutations: MutationTree<LogsState> = {
  setHasInitialized(state) {
    state.hasInitialized = true
  },

  addLogs(state, payload) {
    state.logs = [...payload.logs.reverse(), ...state.logs]
  },
}

export const logsActions: ActionTree<LogsState, RootState> = {
  InitLogs({ commit, state }) {
    if (state.hasInitialized) {
      return
    }

    LogsService.loadInitialLogs().then(res => {
      console.log(res)
      commit('setHasInitialized')
      commit({ type: 'addLogs', logs: res })
      LogsWebSocket.addLogStreamHandler(ev =>
        commit({ type: 'addLogs', logs: JSON.parse(ev.data) })
      )
    })
  },
}

export const logsModule: Module<LogsState, RootState> = {
  namespaced: true,
  state: logsState,
  getters: logsGetters,
  mutations: logsMutations,
  actions: logsActions,
}
