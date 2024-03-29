import { EnvConfig, RuntimeConfig } from '@/models/config'
import { ConfigService } from '@/services/config-service'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootMutationTypes, RootState } from '.'
import { namespaceModule } from './utils/module-helpers'

export enum ConfigStatus {
  UNLOADED = 'UNLOADED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  UPDATING = 'UPDATING',
  ERROR = 'ERROR',
}

export interface ConfigState {
  envConfigStatus: ConfigStatus
  runtimeConfigStatus: ConfigStatus
  envConfigRecord?: EnvConfig
  runtimeConfigRecord?: RuntimeConfig
}

export enum ConfigGetterTypes {
  IsEnvConfigUpdating = 'IsEnvConfigUpdating',
  IsRuntimeConfigUpdating = 'IsRuntimeConfigUpdating',
  HasEnvConfigLoaded = 'HasEnvConfigLoaded',
  HasRuntimeConfigLoaded = 'HasRuntimeConfigLoaded',
  GetEnvConfig = 'GetEnvConfig',
  GetRuntimeConfig = 'GetRuntimeConfig',
  IsConfigUpdating = 'IsConfigUpdating',
  IsConfigLoading = 'IsConfigLoading',
}

export enum ConfigMutationsTypes {
  SetEnvConfigLoading = 'SetEnvConfigLoading',
  SetRuntimeConfigLoading = 'SetRuntimeConfigLoading',
  SetEnvConfigSuccess = 'SetEnvConfigSuccess',
  SetRuntimeConfigSuccess = 'SetRuntimeConfigSuccess',
  SetEnvConfigUpdating = 'SetEnvConfigUpdating',
  SetRuntimeConfigUpdating = 'SetRuntimeConfigUpdating',
}

export enum ConfigActionsTypes {
  GetEnvConfig = 'GetEnvConfig',
  UpdateEnvConfig = 'UpdateEnvConfig',
  GetRuntimeConfig = 'GetRuntimeConfig',
  UpdateRuntimeConfig = 'UpdateRuntimeConfig',
}

export const configState = (): ConfigState => ({
  envConfigStatus: ConfigStatus.UNLOADED,
  runtimeConfigStatus: ConfigStatus.UNLOADED,
  envConfigRecord: undefined,
  runtimeConfigRecord: undefined,
})

export const configGetters: GetterTree<ConfigState, RootState> = {
  [ConfigGetterTypes.IsEnvConfigUpdating]: (state): boolean =>
    state.envConfigStatus === ConfigStatus.UPDATING,

  [ConfigGetterTypes.HasEnvConfigLoaded]: (state): boolean =>
    state.envConfigStatus === ConfigStatus.SUCCESS,

  [ConfigGetterTypes.IsRuntimeConfigUpdating]: (state): boolean =>
    state.runtimeConfigStatus === ConfigStatus.UPDATING,

  [ConfigGetterTypes.HasRuntimeConfigLoaded]: (state): boolean =>
    state.runtimeConfigStatus === ConfigStatus.SUCCESS,

  [ConfigGetterTypes.GetEnvConfig]: (state): EnvConfig | undefined =>
    state.envConfigRecord,

  [ConfigGetterTypes.GetRuntimeConfig]: (state): RuntimeConfig | undefined =>
    state.runtimeConfigRecord,

  [ConfigGetterTypes.IsConfigUpdating]: (state): boolean =>
    [state.envConfigStatus, state.runtimeConfigStatus].includes(
      ConfigStatus.UPDATING
    ),

  [ConfigGetterTypes.IsConfigLoading]: (state): boolean =>
    [state.envConfigStatus, state.runtimeConfigStatus].includes(
      ConfigStatus.LOADING
    ),
}

export const configMutations: MutationTree<ConfigState> = {
  [ConfigMutationsTypes.SetEnvConfigLoading](state) {
    state.envConfigStatus = ConfigStatus.LOADING
  },

  [ConfigMutationsTypes.SetRuntimeConfigLoading](state) {
    state.runtimeConfigStatus = ConfigStatus.LOADING
  },

  [ConfigMutationsTypes.SetEnvConfigSuccess](state, payload) {
    state.envConfigStatus = ConfigStatus.SUCCESS
    state.envConfigRecord = payload.config
  },

  [ConfigMutationsTypes.SetRuntimeConfigSuccess](state, payload) {
    state.runtimeConfigStatus = ConfigStatus.SUCCESS
    state.runtimeConfigRecord = payload.config
  },

  [ConfigMutationsTypes.SetEnvConfigUpdating](state) {
    state.envConfigStatus = ConfigStatus.UPDATING
  },

  [ConfigMutationsTypes.SetRuntimeConfigUpdating](state) {
    state.runtimeConfigStatus = ConfigStatus.UPDATING
  },
}

export const configActions: ActionTree<ConfigState, RootState> = {
  [ConfigActionsTypes.GetEnvConfig]({ commit, state }) {
    if (
      [
        ConfigStatus.SUCCESS,
        ConfigStatus.UPDATING,
        ConfigStatus.LOADING,
      ].includes(state.envConfigStatus)
    ) {
      return
    }

    commit({ type: ConfigMutationsTypes.SetEnvConfigLoading })

    ConfigService.getEnvConfig().then(config => {
      commit({ type: ConfigMutationsTypes.SetEnvConfigSuccess, config })
    })
  },

  [ConfigActionsTypes.UpdateEnvConfig]({ commit, state }, newConfig) {
    if (state.envConfigStatus !== ConfigStatus.SUCCESS) {
      return
    }

    commit({ type: ConfigMutationsTypes.SetEnvConfigUpdating })

    ConfigService.updateEnvConfig(newConfig).then(res => {
      commit({
        type: ConfigMutationsTypes.SetEnvConfigSuccess,
        config: res.config,
      })
    })
  },

  [ConfigActionsTypes.GetRuntimeConfig]({ commit, state }) {
    if (
      [
        ConfigStatus.SUCCESS,
        ConfigStatus.UPDATING,
        ConfigStatus.LOADING,
      ].includes(state.runtimeConfigStatus)
    ) {
      return
    }

    commit({ type: ConfigMutationsTypes.SetRuntimeConfigLoading })

    ConfigService.getRuntimeConfig().then(config => {
      commit({ type: ConfigMutationsTypes.SetRuntimeConfigSuccess, config })
    })
  },

  [ConfigActionsTypes.UpdateRuntimeConfig]({ commit, state }, newConfig) {
    if (state.runtimeConfigStatus !== ConfigStatus.SUCCESS) {
      return
    }

    commit({ type: ConfigMutationsTypes.SetRuntimeConfigUpdating })

    ConfigService.updateRuntimeConfig(newConfig).then(res => {
      console.log(res)
      commit({
        type: ConfigMutationsTypes.SetRuntimeConfigSuccess,
        config: res.config,
      })
    })
  },
}

export const ConfigStoreTypes = namespaceModule(
  'config',
  ConfigGetterTypes,
  ConfigMutationsTypes,
  ConfigActionsTypes
)

export const configModule: Module<ConfigState, RootState> = {
  namespaced: true,
  state: configState,
  getters: configGetters,
  mutations: configMutations,
  actions: configActions,
}
