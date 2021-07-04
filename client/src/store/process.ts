import { Stat } from '@/models/process-stat'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '.'
import { namespaceModule } from './utils/module-helpers'

export enum ProcessStatus {
  UNLOADED = 'UNLOADED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  UPDATING = 'UPDATING',
  ERROR = 'ERROR',
}

export interface ProcessState {
  processStats: Stat[]
}

export enum ProcessGetterTypes {
  GetProcessStats = 'GetProcessStats',
}

export enum ProcessMutationsTypes {
  AddProcessStats = 'AddProcessStats',
}

export enum ProcessActionsTypes {
  GetProcessStats = 'GetProcessStats',
}

export const ProcessState = (): ProcessState => ({
  processStats: [],
})

export const ProcessGetters: GetterTree<ProcessState, RootState> = {
  [ProcessGetterTypes.GetProcessStats]: (state): Stat[] => state.processStats,
}

export const ProcessMutations: MutationTree<ProcessState> = {
  [ProcessMutationsTypes.AddProcessStats](state, payload) {
    state.processStats = state.processStats.concat(payload.stats)
  },
}

export const ProcessActions: ActionTree<ProcessState, RootState> = {
  [ProcessActionsTypes.GetProcessStats]({ commit }, payload) {
    console.log('inside process action')
    commit({
      type: ProcessMutationsTypes.AddProcessStats,
      stats: payload.stats,
    })
  },
}

export const ProcessStoreTypes = namespaceModule(
  'process',
  ProcessGetterTypes,
  ProcessMutationsTypes,
  ProcessActionsTypes
)

export const processModule: Module<ProcessState, RootState> = {
  namespaced: true,
  state: ProcessState,
  getters: ProcessGetters,
  mutations: ProcessMutations,
  actions: ProcessActions,
}
