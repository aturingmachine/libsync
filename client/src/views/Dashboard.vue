<template>
  <div class="page dashboard-page">
    <h1>
      LibSync Dashboard
      <button class="icon settings-icon" @click="showModal = true">
        <icon>settings</icon>
      </button>
    </h1>
    <div class="widgets-header">
      <dashboard-settings @close="showModal = false" :showModal="showModal" />
    </div>
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
import DashboardSettings from '@/components/widgets/dashboard-settings/DashboardSettings.vue'

export default Vue.extend({
  name: 'DashboardPage',

  components: {
    DashboardSettings,
    DynamicWidget,
  },

  data: () => {
    return {
      showModal: false,
    }
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

.settings-icon {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: absolute;
  right: 25px;

  &:hover {
    transform: rotate(180deg);
  }
}
</style>
