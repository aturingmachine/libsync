import Vue from 'vue'
import Vuex from 'vuex'
import { configModule } from './config'
import { logsModule } from './logs'

export interface RootState {
  isDarkMode: boolean
}

export const rootState = (): RootState => ({
  isDarkMode: false,
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: rootState,
  mutations: {},
  actions: {},
  modules: {
    logs: logsModule,
    config: configModule,
  },
})
