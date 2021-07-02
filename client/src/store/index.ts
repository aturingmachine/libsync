import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex'
import { configModule } from './config'
import { logsModule } from './logs'

export interface RootState {
  isDarkMode: boolean
  isLocked: boolean
}

export const rootState = (): RootState => ({
  isDarkMode: false,
  isLocked: true,
})

export enum RootMutationTypes {
  SetIsLocked = 'SetIsLocked',
}

const mutations: MutationTree<RootState> = {
  [RootMutationTypes.SetIsLocked](state, payload) {
    state.isLocked = payload.status
  },
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: rootState,
  mutations,
  actions: {},
  modules: {
    logs: logsModule,
    config: configModule,
  },
})
