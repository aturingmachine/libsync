import Vue from 'vue'
import Vuex, { GetterTree, MutationTree } from 'vuex'
import { configModule } from './config'
import { logsModule } from './logs'

export interface RootState {
  isDarkMode: boolean
  isLocked: boolean
  isLoading: boolean
  isNavDrawerOpen: boolean
  isNavDrawerCollapsed: boolean
}

export const rootState = (): RootState => ({
  isDarkMode: false,
  isLocked: true,
  isLoading: false,
  isNavDrawerOpen: false,
  isNavDrawerCollapsed: false,
})

export enum RootGetterTypes {
  IsLoading = 'IsLoading',
  IsNavDrawerOpen = 'IsNavDrawerOpen',
  IsNavDrawerCollapsed = 'IsNavDrawerCollapsed',
}

export enum RootMutationTypes {
  SetIsLocked = 'SetIsLocked',
  SetIsLoading = 'SetIsLoading',
  SetNavDrawerOpen = 'SetNavDrawerOpen',
  SetNavDrawerCollapsed = 'SetNavDrawerCollapsed',
}

const getters: GetterTree<RootState, RootState> = {
  [RootGetterTypes.IsLoading]: (state): boolean => state.isLoading,

  [RootGetterTypes.IsNavDrawerOpen]: (state): boolean => state.isNavDrawerOpen,

  [RootGetterTypes.IsNavDrawerCollapsed]: (state): boolean =>
    state.isNavDrawerCollapsed,
}

const mutations: MutationTree<RootState> = {
  [RootMutationTypes.SetIsLocked](state, payload) {
    state.isLocked = payload.status
  },

  [RootMutationTypes.SetIsLoading](state, payload) {
    state.isLoading = payload.isLoading
  },

  [RootMutationTypes.SetNavDrawerOpen](state, payload) {
    state.isNavDrawerOpen = payload.isOpen
  },

  [RootMutationTypes.SetNavDrawerCollapsed](state, payload) {
    state.isNavDrawerCollapsed = payload.isCollapsed
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
