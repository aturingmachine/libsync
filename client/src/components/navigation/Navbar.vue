<template>
  <div class="nav-bar">
    <transition name="slide-in">
      <nav-drawer v-show="isOpen" />
    </transition>
    <div class="button-container">
      <button @click.prevent="setDrawerOpen(isOpen)" class="menu-button">
        <transition name="menu-icon">
          <icon :key="menuIcon">{{ menuIcon }}</icon>
        </transition>
      </button>

      <router-link class="logo" to="/">
        LibSync
      </router-link>
    </div>

    <div class="lock-status">
      <tooltip direction="Left" :msg="lockTooltip">
        <icon :class="isLocked ? 'locked' : 'unlocked'">
          {{ isLocked ? 'lock' : 'lock_open' }}
        </icon>
      </tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavDrawer from '@/components/navigation/NavDrawer.vue'
import { RootGetterTypes, RootMutationTypes } from '@/store'
import Tooltip from '@/components/misc/Tooltip.vue'

export default Vue.extend({
  name: 'Navbar',

  components: {
    NavDrawer,
    Tooltip,
  },

  computed: {
    isOpen(): boolean {
      return this.$store.getters[RootGetterTypes.IsNavDrawerOpen]
    },

    isLocked(): boolean {
      return this.$store.getters[RootGetterTypes.IsLocked]
    },

    lockTooltip(): string {
      return this.isLocked
        ? 'LibSync is currently locked. A Configuration may be updating or a Sync is in progress.'
        : 'LibSync is not currently occupied with a blocking task.'
    },

    menuIcon(): string {
      return this.isOpen ? 'menu_open' : 'menu'
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

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

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
  transition: all 0.5s ease-out;

  &.locked {
    color: $warning;
    transform: none;
  }

  &.unlocked {
    color: $success;
    transform: none;
  }
}

.lock-status {
  margin-right: 20px;
}

.button-container {
  display: flex;
  align-items: center;
}

.menu-button {
  display: flex;
}

#nav a.logo {
  &.router-link-exact-active {
    color: rgb(232, 230, 227);
  }
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

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s ease;
}

.slide-in-enter,
.slide-in-leave-to {
  position: fixed;
  margin-left: -100%;
}

.menu-icon-enter-active,
.menu-icon-leave-active {
  transition: all 0.5s ease-out;
}

.menu-icon-enter,
.menu-icon-leave-to {
  position: absolute;
  opacity: 0;
  transform: rotate3d(0.5, 0.1, 2, 180deg);
}
</style>
