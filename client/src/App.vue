<template>
  <div id="app">
    <div class="header">
      <div id="nav">
        <nav-bar />
      </div>
      <loading-bar />
    </div>
    <router-view :class="[openClass, collapsedClass]" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/navigation/Navbar.vue'
import LoadingBar from '@/components/misc/LoadingBar.vue'
import { LockWebSocket } from './services/websocket'
import { RootGetterTypes, RootMutationTypes } from './store'

export default Vue.extend({
  name: 'LibSync',

  components: {
    LoadingBar,
    NavBar,
  },

  computed: {
    openClass(): string {
      return this.$store.getters[RootGetterTypes.IsNavDrawerOpen]
        ? 'drawer-open'
        : ''
    },

    collapsedClass(): string {
      return this.$store.getters[RootGetterTypes.IsNavDrawerCollapsed]
        ? 'drawer-collapsed'
        : ''
    },
  },

  mounted(): void {
    LockWebSocket.addStatusHandler(ev => {
      const lockedStatus = JSON.parse(ev.data).isLocked
      if (lockedStatus !== this.$store.state.isLocked) {
        this.$store.commit({
          type: RootMutationTypes.SetIsLocked,
          status: JSON.parse(ev.data).isLocked,
        })
      }
    })
  },
})
</script>

<style lang="scss">
@import './assets/styles/main.scss';
.header {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: fixed;
  top: 0;
  z-index: 10;
}

.page {
  padding: 100px;
  transition: width 0.3s ease, margin 0.2s ease;

  &::before {
    opacity: 0;
    transition: all 0.3s ease-in;
  }

  &.drawer-open {
    width: calc(100% - 200px) !important;
    margin-left: 200px !important;

    &.drawer-collapsed {
      width: calc(100% - 50px) !important;
      margin-left: 50px !important;

      &::before {
        opacity: 0;
        visibility: hidden;
      }
    }

    &::before {
      opacity: 1;
      content: '';
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.733);
      z-index: 9;
    }
  }
}
</style>
