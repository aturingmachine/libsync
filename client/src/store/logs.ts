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

  filteredLogs: state => (searchTerm: string): Log[] => {
    if (searchTerm.length === 0) {
      return state.logs
    }

    const lcTerms = searchTerm.toLowerCase().split(/\s|\//g)

    return state.logs.filter(log => {
      return (
        lcTerms.includes(log.func.toLowerCase()) ||
        lcTerms.includes(log.service.toLowerCase()) ||
        log.message
          .toLowerCase()
          .split(/\s|\//g)
          .filter(word => word.length > 1)
          .some(word => {
            return (
              lcTerms.includes(word) ||
              lcTerms.some(
                term =>
                  (term.includes(word) || word.includes(term)) &&
                  word.length > 4
              )
            )
          }) ||
        new Date(log.timestamp as string)
          .toLocaleString()
          .toLowerCase()
          .split(' ')
          .some(x => lcTerms.includes(x))
      )
    })
  },
}

export const logsMutations: MutationTree<LogsState> = {
  setHasInitialized(state) {
    state.hasInitialized = true
  },

  addLogs(state, payload: { logs: Log[] }) {
    state.logs = payload.logs
      .reverse()
      .concat(state.logs)
      .slice(0, 350)
  },
}

export const logsActions: ActionTree<LogsState, RootState> = {
  InitLogs({ commit, state }) {
    if (state.hasInitialized) {
      return
    }

    LogsService.loadInitialLogs().then(res => {
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
