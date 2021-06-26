import { Config } from '@/models/config'
import { ConfigService } from '@/services/config-service'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '.'

export enum ConfigStatus {
  UNLOADED = 'UNLOADED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  UPDATING = 'UPDATING',
  ERROR = 'ERROR',
}

export interface ConfigState {
  status: ConfigStatus
  record?: Config
}

export const configState = (): ConfigState => ({
  status: ConfigStatus.UNLOADED,
  record: undefined,
})

export const configGetters: GetterTree<ConfigState, RootState> = {
  IsConfigUpdating: (state): boolean => state.status === ConfigStatus.UPDATING,
  HasConfigLoaded: (state): boolean => state.status === ConfigStatus.SUCCESS,
  GetConfig: (state): Config | undefined => state.record,
}

export const configMutations: MutationTree<ConfigState> = {
  SetConfigLoading(state) {
    state.status = ConfigStatus.LOADING
  },

  SetConfigSuccess(state, payload) {
    state.status = ConfigStatus.SUCCESS
    console.log(payload.config)
    state.record = payload.config
  },

  SetConfigUpdating(state) {
    state.status = ConfigStatus.UPDATING
  },
}

export const configActions: ActionTree<ConfigState, RootState> = {
  GetConfig({ commit, state }) {
    if (
      [
        ConfigStatus.SUCCESS,
        ConfigStatus.UPDATING,
        ConfigStatus.LOADING,
      ].includes(state.status)
    ) {
      return
    }

    commit({ type: 'SetConfigLoading' })

    ConfigService.getConfig().then(config => {
      console.log(config)
      commit({ type: 'SetConfigSuccess', config })
    })
  },

  UpdateConfig({ commit, state }, newConfig) {
    if (state.status !== ConfigStatus.SUCCESS) {
      return
    }

    commit({ type: 'SetConfigUpdating' })

    ConfigService.updateConfig(newConfig).then(res => {
      console.log(res)
    })
  },
}

export const configModule: Module<ConfigState, RootState> = {
  namespaced: true,
  state: configState,
  getters: configGetters,
  mutations: configMutations,
  actions: configActions,
}
