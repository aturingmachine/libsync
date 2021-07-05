<template>
  <div class="page dashboard-page">
    <h1>LibSync Dashboard</h1>
    <div v-if="hasLoaded" class="widgets">
      <template v-for="widget in widgets">
        <dynamic-widget :key="widget.name + widget.auxId" :widget="widget" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Widget } from '@/store/widgets/models'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import DynamicWidget from '@/components/widgets/DynamicWidget.vue'

export default Vue.extend({
  name: 'DashboardPage',

  components: {
    DynamicWidget,
  },

  computed: {
    hasLoaded(): boolean {
      return this.$store.getters[WidgetStoreTypes.getters.HasConfigLoaded]
    },

    widgets(): Widget[] {
      return this.$store.getters[WidgetStoreTypes.getters.GetVisibleWidgets]
    },

    visibleWidgets(): Widget[] {
      return this.$store.getters[WidgetStoreTypes.getters.GetVisibleWidgets]
    },
  },

  methods: {
    hasAuxillaryOptions(widget: Widget): boolean {
      return !!widget?.configuration?.customOptions?.auxillary
    },
  },

  mounted(): void {
    this.$store.dispatch(WidgetStoreTypes.actions.GetWidgetConfigurations)
  },
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  width: 100%;
  padding: 100px 36px;
  box-sizing: border-box;
}

.widgets {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
}
</style>
