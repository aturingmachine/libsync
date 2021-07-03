<template>
  <div class="nav-drawer-container" :class="collapsedClass">
    <button
      :class="collapsedClass"
      @click.prevent="collapse(isCollapsed)"
      class="collapse-button"
    >
      <icon>arrow_forward_ios</icon>
    </button>
    <router-link
      class="nav-link"
      v-for="(link, index) in navLinks"
      :key="index"
      :to="link.route"
    >
      <span v-if="!isCollapsed" class="nav-label"> {{ link.title }} </span>
      <icon>{{ link.icon }}</icon>
    </router-link>
  </div>
</template>

<script lang="ts">
import { RootGetterTypes, RootMutationTypes } from '@/store'
import Vue from 'vue'

export default Vue.extend({
  name: 'NavDrawer',

  data: () => {
    return {
      navLinks: [
        {
          title: 'About',
          route: '/about',
          icon: 'info',
        },
        {
          title: 'Logs',
          route: '/logs',
          icon: 'list',
        },
        {
          title: 'Configuration',
          route: '/config',
          icon: 'settings',
        },
      ],
    }
  },

  computed: {
    isCollapsed(): boolean {
      return this.$store.getters[RootGetterTypes.IsNavDrawerCollapsed]
    },

    collapsedClass(): string {
      return this.isCollapsed ? 'collapsed' : ''
    },
  },

  methods: {
    collapse(isCollapsed: boolean): void {
      this.$store.commit({
        type: RootMutationTypes.SetNavDrawerCollapsed,
        isCollapsed: !isCollapsed,
      })
    },
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

.nav-drawer-container {
  position: fixed;
  top: 60px;
  background-color: rgb(35, 46, 57);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  width: 200px;
  padding-top: 20px;
  align-items: flex-start;
  transition: all 0.2s ease-out;
  z-index: 2;

  &.collapsed {
    width: 50px;

    .nav-link {
      width: calc(100% - 22px);
      padding: 0 12px 0 10px;
      justify-content: flex-end;
    }
  }
}

.nav-link {
  display: flex;
  height: 60px;
  margin-bottom: 12px;
  align-items: center;
  background-color: rgb(45, 59, 73);
  width: calc(100% - 20px);
  padding: 0 10px 0 10px;
  justify-content: space-between;
  transition: all 0.2s ease-out;

  &:hover {
    background-color: $tertiary;
  }
}

.collapse-button {
  color: $primary-text;
  border-color: $primary;
  background-color: rgb(35, 46, 57);
  position: absolute;
  right: -40px;
  top: 0;
  left: 100%;
  border: none;
  border-bottom-right-radius: 10px;

  span {
    transition: all 0.2s ease-out;
  }

  &.collapsed {
    span {
      transform: rotate(180deg);
    }
  }
}
</style>
