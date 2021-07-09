<template>
  <modal class="dashboard-settings" v-if="showModal" @close="close()">
    <template v-slot:header>
      <div>
        <h3>Libsync Dashboard Settings</h3>
      </div>
    </template>

    <template v-slot:body>
      <div class="settings-body">
        <widget-ordering />
        <toggle-widget-list />
      </div>
    </template>

    <template v-slot:footer>
      <button @click="close()" class="button neutral-button wide">
        Close
      </button>
    </template>
  </modal>
</template>

<script lang="ts">
import Vue from 'vue'
import Modal from '@/components/modals/Modal.vue'
import WidgetOrdering from '@/components/widgets/dashboard-settings/WidgetOrdering.vue'
import ToggleWidgetList from '@/components/widgets/dashboard-settings/ToggleWidgetList.vue'

export default Vue.extend({
  name: 'DashboardSettings',

  components: {
    Modal,
    ToggleWidgetList,
    WidgetOrdering,
  },

  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close(): void {
      this.$emit('close')
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

section {
  margin-bottom: 32px;
  border: 1px solid $border-primary;
  padding: 16px 0;
  background-color: $secondary;
  box-shadow: inset 1px 1px 1px black;
  border-radius: 5px;
}

.settings-body {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
