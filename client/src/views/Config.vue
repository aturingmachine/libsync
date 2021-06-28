<template>
  <div class="config-page-wrapper">
    <div class="tabs">
      <button
        class="config-tab left"
        :class="currentTab === 0 ? 'active' : ''"
        @click="setTab(0)"
      >
        Env Config
      </button>
      <button
        class="config-tab right"
        :class="currentTab === 1 ? 'active' : ''"
        @click="setTab(1)"
      >
        Runtime Config
      </button>
    </div>

    <div class="env-page-content">
      <transition :name="transitionName" mode="out-in">
        <component v-bind:is="page"></component>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EnvConfig from '@/components/config-tab/EnvConfig.vue'
import RuntimeConfig from '@/components/config-tab/RuntimeConfig.vue'

export default Vue.extend({
  name: 'Config',

  components: {
    'env-config': EnvConfig,
    'runtime-config': RuntimeConfig,
  },

  computed: {
    page(): string {
      return this.currentTab === 0 ? 'env-config' : 'runtime-config'
    },

    transitionName(): string {
      return this.currentTab === 0 ? 'fade-left' : 'fade-right'
    },
  },

  data: () => {
    return {
      currentTab: 0,
    }
  },

  methods: {
    setTab(tabNumber: number): void {
      this.currentTab = tabNumber
    },
  },
})
</script>

<style scoped>
.config-page-wrapper {
  width: 100%;
}

.env-page-content {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
  overflow-x: hidden;
  min-height: 90vh;
}

.tabs {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-bottom: 2px solid black;
}

.config-tab {
  padding: 6px 16px;
  font-size: 24px;
  border: 2px solid black;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
}

.config-tab.active {
  padding-bottom: 15px;
}

.config-tab.active:hover {
  padding-bottom: 15px;
}

.config-tab:hover {
  padding-bottom: 10px;
}

.config-tab.left {
  margin-right: 8px;
}

.config-tab.right {
  margin-left: 8px;
}

.fade-left-enter-active,
.fade-right-enter-active {
  transition: all 0.5s ease-in-out;
}

.fade-left-leave-active,
.fade-right-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-left-enter,
.fade-right-enter {
  opacity: 0;
}

.fade-left-enter {
  transform: translateX(-250px);
}

.fade-right-enter {
  transform: translateX(250px);
}

.fade-left-leave-to {
  transform: translateX(250px);
}

.fade-right-leave-to {
  transform: translateX(-250px);
}

.fade-left-leave-to,
.fade-right-leave-to {
  opacity: 0;
}
</style>
