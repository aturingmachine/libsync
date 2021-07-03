import Vue from 'vue'
import Vuex, { GetterTree, MutationTree } from 'vuex'
import { configModule } from './config'
import { logsModule } from './logs'

export interface RootState {
  isDarkMode: boolean
  isLocked: boolean
  isLoading: boolean
}

export const rootState = (): RootState => ({
  isDarkMode: false,
  isLocked: true,
  isLoading: false,
})

export enum RootGetterTypes {
  IsLoading = 'IsLoading',
}

export enum RootMutationTypes {
  SetIsLocked = 'SetIsLocked',
  SetIsLoading = 'SetIsLoading',
}

const getters: GetterTree<RootState, RootState> = {
  [RootGetterTypes.IsLoading]: (state): boolean => state.isLoading,
}

const mutations: MutationTree<RootState> = {
  [RootMutationTypes.SetIsLocked](state, payload) {
    state.isLocked = payload.status
  },

  [RootMutationTypes.SetIsLoading](state, payload) {
    state.isLoading = payload.isLoading
  },
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: rootState,
  getters,
  mutations,
  actions: {},
  modules: {
    logs: logsModule,
    config: configModule,
  },
})
