<template>
  <div class="page snapshots-page">
    <lib-root
      v-for="lib in snapshots"
      :key="lib.key"
      :libSnapshots="lib.snapshots"
      :libName="lib.key"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SnapshotsStoreTypes } from '../store/snapshots'
import LibRoot from '@/components/snapshots/LibRoot.vue'
import { LibSnapshot } from '../models/lib-snapshots'

export default Vue.extend({
  name: 'LibSnapshots',

  components: {
    LibRoot,
  },

  data: () => {
    return {}
  },

  computed: {
    snapshots(): { key: string; snapshots: LibSnapshot[] }[] {
      return Object.keys(
        this.$store.getters[SnapshotsStoreTypes.getters.GetSnapshots]
      ).map(key => ({
        key,
        snapshots: this.$store.getters[
          SnapshotsStoreTypes.getters.GetSnapshots
        ][key] as LibSnapshot[],
      }))
    },
  },

  mounted(): void {
    this.$store.dispatch(SnapshotsStoreTypes.actions.GetSnapshots)
  },
})
</script>

<style lang="scss" scoped>
.snapshots-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
</style>
