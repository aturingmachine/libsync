<template>
  <div class="nav-bar">
    <div class="button-container">
      <button class="menu-button">
        &#9776;
      </button>

      <router-link class="logo" to="/">
        LibSync
      </router-link>
    </div>

    <div class="links">
      <router-link
        class="nav-link"
        v-for="(link, index) in navLinks"
        :key="index"
        :to="link.route"
      >
        {{ link.title }}
      </router-link>
    </div>
  </div>
</template>

|
<router-link to="/about">About</router-link> |
<router-link to="/logs">Logs</router-link> |
<router-link to="/config">Config</router-link>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Navbar',

  props: {},

  data: () => {
    return {
      navLinks: [
        {
          title: 'Home',
          route: '/',
        },
        {
          title: 'About',
          route: '/about',
        },
        {
          title: 'Logs',
          route: '/logs',
        },
        {
          title: 'Configuration',
          route: '/config',
        },
      ],
    }
  },

  watch: {},
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
</style>
