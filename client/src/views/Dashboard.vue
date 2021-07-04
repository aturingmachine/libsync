<template>
  <div class="page dashboard-page">
    <h1>LibSync Dashboard</h1>
    <div v-if="hasLoaded" class="widgets">
      <template v-for="widget in visibleWidgets">
        <template v-if="hasAuxillaryOptions">
          <dynamic-widget
            v-for="opt in widget.configuration.customOptions.auxillary"
            :key="opt"
            :widget="widget"
            :auxillaryOptions="[opt]"
          />
        </template>
        <template v-else>
          <dynamic-widget :key="widget.name" :widget="widget" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Widget, WidgetRecords } from '@/store/widgets/models'
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

    widgets(): WidgetRecords {
      return this.$store.getters[WidgetStoreTypes.getters.GetWidgets]
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
  max-width: 900px;
}

.widgets {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
