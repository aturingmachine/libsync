import { Log } from '@/models/logs'
import { GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '.'
import { namespace } from 'vuex-class'

export const LogsStore = namespace('logs')

export interface LogsState {
  logs: Log[]
}

export const logsState = (): LogsState => ({ logs: [] })

export const logsGetters: GetterTree<LogsState, RootState> = {
  getLogs: (state): Log[] => state.logs,
}

export const logsMutations: MutationTree<LogsState> = {
  addLogs(state, payload) {
    // console.log('Payload', payload)
    state.logs = [...payload.reverse(), ...state.logs]
  },
}

export const logsModule: Module<LogsState, RootState> = {
  namespaced: true,
  state: logsState,
  getters: logsGetters,
  mutations: logsMutations,
}
