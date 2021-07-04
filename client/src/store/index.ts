import Vue from 'vue'
import Vuex, { GetterTree, MutationTree } from 'vuex'
import { configModule } from './config'
import { logsModule } from './logs'
import { processModule } from './process'
import { widgetsModule } from './widgets/widget-store'

export interface RootState {
  isDarkMode: boolean
  isLocked: boolean
  isLoading: boolean
  isNavDrawerOpen: boolean
  isNavDrawerCollapsed: boolean
  hasShownIntro: boolean
}

export const rootState = (): RootState => ({
  isDarkMode: false,
  isLocked: true,
  isLoading: false,
  isNavDrawerOpen: false,
  isNavDrawerCollapsed: false,
  hasShownIntro: false,
})

export enum RootGetterTypes {
  IsLoading = 'IsLoading',
  IsNavDrawerOpen = 'IsNavDrawerOpen',
  IsNavDrawerCollapsed = 'IsNavDrawerCollapsed',
  IsLocked = 'IsLocked',
  HasShownIntro = 'HasShownIntro',
}

export enum RootMutationTypes {
  SetIsLocked = 'SetIsLocked',
  SetIsLoading = 'SetIsLoading',
  SetNavDrawerOpen = 'SetNavDrawerOpen',
  SetNavDrawerCollapsed = 'SetNavDrawerCollapsed',
  SetHasShownIntro = 'SetHasShownIntro',
}

const getters: GetterTree<RootState, RootState> = {
  [RootGetterTypes.IsLocked]: (state): boolean => state.isLocked,

  [RootGetterTypes.IsLoading]: (state): boolean => state.isLoading,

  [RootGetterTypes.IsNavDrawerOpen]: (state): boolean => state.isNavDrawerOpen,

  [RootGetterTypes.IsNavDrawerCollapsed]: (state): boolean =>
    state.isNavDrawerCollapsed,

  [RootGetterTypes.HasShownIntro]: (state): boolean => state.hasShownIntro,
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

  [RootMutationTypes.SetHasShownIntro](state) {
    state.hasShownIntro = true
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
    widgets: widgetsModule,
    process: processModule,
  },
})
