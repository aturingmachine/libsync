<template>
  <div id="app">
    <div class="header">
      <div id="nav">
        <nav-bar />
      </div>
      <loading-bar />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/navigation/Navbar.vue'
import LoadingBar from '@/components/misc/LoadingBar.vue'
import { LockWebSocket } from './services/websocket'
import { RootMutationTypes } from './store'

export default Vue.extend({
  name: 'LibSync',

  components: {
    LoadingBar,
    NavBar,
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
  z-index: 5;
}

.page {
  padding: 100px;
}
</style>
