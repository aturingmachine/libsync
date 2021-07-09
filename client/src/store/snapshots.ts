import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '.'
import { LibSnapshotRecord } from '../models/lib-snapshots'
import { SnapshotsService } from '../services/snapshots-service'
import { namespaceModule } from './utils/module-helpers'

export enum SnapshotsStatus {
  UNLOADED = 'UNLOADED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  UPDATING = 'UPDATING',
  ERROR = 'ERROR',
}

export interface SnapshotsState {
  snapshots: LibSnapshotRecord
}

export enum SnapshotsGetterTypes {
  GetSnapshots = 'GetSnapshots',
}

export enum SnapshotsMutationsTypes {
  AddSnapshots = 'AddSnapshots',
}

export enum SnapshotsActionsTypes {
  GetSnapshots = 'GetSnapshots',
}

export const SnapshotsState = (): SnapshotsState => ({
  snapshots: {},
})

export const SnapshotsGetters: GetterTree<SnapshotsState, RootState> = {
  [SnapshotsGetterTypes.GetSnapshots]: (state): LibSnapshotRecord =>
    state.snapshots,
}

export const SnapshotsMutations: MutationTree<SnapshotsState> = {
  [SnapshotsMutationsTypes.AddSnapshots](state, payload) {
    state.snapshots = payload.snapshots
  },
}

export const SnapshotsActions: ActionTree<SnapshotsState, RootState> = {
  [SnapshotsActionsTypes.GetSnapshots]({ commit }) {
    SnapshotsService.getSnapshots().then(res => {
      console.log(res)
      commit({
        type: SnapshotsMutationsTypes.AddSnapshots,
        snapshots: res,
      })
    })
  },
}

export const SnapshotsStoreTypes = namespaceModule(
  'snapshots',
  SnapshotsGetterTypes,
  SnapshotsMutationsTypes,
  SnapshotsActionsTypes
)

export const snapshotsModule: Module<SnapshotsState, RootState> = {
  namespaced: true,
  state: SnapshotsState,
  getters: SnapshotsGetters,
  mutations: SnapshotsMutations,
  actions: SnapshotsActions,
}
