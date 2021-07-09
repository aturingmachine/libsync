<template>
  <div class="snapshot-wrapper">
    <h3>{{ new Date(timestamp).toLocaleString() }}</h3>
    <dir-line
      v-for="[key, line] in initialDirLines"
      :key="line.fullRelativepath"
      :level="1"
      :struct="line.contents"
      :path="key"
      :isDir="line.isDir"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DirStruct, DirStructInside } from '../../models/lib-snapshots'
import DirLine from './DirLine.vue'

export default Vue.extend({
  name: 'Snapshot',

  components: {
    DirLine,
  },

  props: {
    dirStruct: {
      type: Object as PropType<DirStruct>,
      required: true,
    },

    timestamp: {
      type: Number,
      required: true,
    },
  },

  data: () => {
    return {}
  },

  computed: {
    initialDirLines(): [string, DirStructInside][] {
      return Object.entries(this.dirStruct)
    },
  },
})
</script>
