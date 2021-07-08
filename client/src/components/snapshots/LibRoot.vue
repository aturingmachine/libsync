<template>
  <div class="lib-root-wrapper">
    <h1>{{ libName }}</h1>
    <div class="lib-structure">
      <snapshot
        v-for="snapshot in libSnapshots"
        :dirStruct="snapshot.dirStruct"
        :timestamp="snapshot.timestamp"
        :key="snapshot.timestamp"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { LibSnapshot } from '../../models/lib-snapshots'
import Snapshot from './Snapshot.vue'

export default Vue.extend({
  name: 'LibRoot',

  components: {
    Snapshot,
  },

  props: {
    libSnapshots: {
      type: Array as PropType<LibSnapshot[]>,
      required: true,
    },

    libName: {
      type: String,
      required: true,
    },
  },

  data: () => {
    return {}
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.lib-root-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
}

.lib-structure {
  width: 100%;
  border: 1px solid $border-primary;
  border-radius: 10px;
  background-color: $secondary;
  padding-bottom: 12px;
}
</style>
