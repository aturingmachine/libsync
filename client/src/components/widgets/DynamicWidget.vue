<template>
  <div class="dynamic-widget-wrapper">
    <component :is="widget.name" :size-class="sizeClass" :widget="widget" />
  </div>
</template>

<script lang="ts">
import { Widget } from '@/store/widgets/models'
import Vue, { PropType } from 'vue'
import LockStatusWidget from './LockStatusWidget.vue'

export default Vue.extend({
  name: 'DynamicWidget',

  components: {
    LockStatusWidget,
  },

  props: {
    widget: {
      type: Object as PropType<Widget>,
      required: true,
    },
  },

  computed: {
    sizeClass(): string {
      return `widget-size-${this.widget.configuration.size}`
    },
  },
})
</script>

<style lang="scss" scoped>
.dynamic-widget-wrapper {
  display: flex;
  flex-grow: 1;
}
</style>
