<template>
  <div class="nav-bar">
    <transition name="slide-in">
      <nav-drawer v-show="isOpen" />
    </transition>
    <div class="button-container">
      <button @click.prevent="setDrawerOpen(isOpen)" class="menu-button">
        <icon>menu</icon>
      </button>

      <router-link class="logo" to="/">
        LibSync
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavDrawer from '@/components/navigation/NavDrawer.vue'
import { RootGetterTypes, RootMutationTypes } from '@/store'

export default Vue.extend({
  name: 'Navbar',

  components: {
    NavDrawer,
  },

  computed: {
    isOpen(): boolean {
      return this.$store.getters[RootGetterTypes.IsNavDrawerOpen]
    },
  },

  methods: {
    setDrawerOpen(isOpen: boolean): void {
      this.$store.commit({
        type: RootMutationTypes.SetNavDrawerOpen,
        isOpen: !isOpen,
      })
    },
  },
})
</script>

<style scoped>
.nav-bar {
  width: 100%;
  height: 60px;
  display: flex;
  background-color: rgb(35, 46, 57);
  box-shadow: rgb(10, 26, 37) 3px 0px 15px 3px;
  align-items: center;
  justify-content: space-between;
}

.material-icons {
  font-size: 36px !important;
}

.button-container {
  display: flex;
  align-items: center;
}

.menu-button {
  display: flex;
}

.logo,
.menu-button {
  margin-left: 16px;
  border: none;
  background-color: transparent;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgb(232, 230, 227);
  cursor: pointer;
  text-decoration: none;
}

.logo:hover,
.menu-button:hover {
  transition: text-shadow 0.2s ease-in-out;
  text-shadow: 2px 2px 2px #42b983, -2px -2px 2px #42b983;
}

.links {
  margin-right: 16px;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.nav-link:hover {
  transition: text-shadow 0.2s ease-in-out;
  text-shadow: 2px 2px 2px #42b983, -2px -2px 2px #42b983;
}

.logo.router-link-exact-active:hover,
.nav-link.router-link-exact-active:hover {
  text-shadow: none;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter,
.slide-in-leave-to {
  position: fixed;
  margin-left: -100%;
}
</style>
