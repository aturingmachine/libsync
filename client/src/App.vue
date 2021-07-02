<template>
  <div id="app">
    <div id="nav">
      <nav-bar />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/navigation/Navbar.vue'
import { LockWebSocket } from './services/websocket'
import { RootMutationTypes } from './store'

export default Vue.extend({
  name: 'LibSync',

  components: {
    NavBar,
  },

  mounted(): void {
    console.log('Mounting APp')
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

<style>
body {
  background-color: rgb(21, 32, 43);
  font-family: Roboto;
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(232, 230, 227);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 48px;
}

#nav {
  /* padding: 30px; */
  margin-bottom: 64px;
  width: 100%;
}

#nav a {
  font-weight: bold;
  color: rgb(232, 230, 227);
}

#nav a.router-link-exact-active {
  color: #42b983;
}

input {
  border: 2px solid lightgray;
  border-radius: 8px;
  padding: 2px 4px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
html::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
html {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
