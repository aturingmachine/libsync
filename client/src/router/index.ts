import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Logs from '../views/Logs.vue'
import Config from '../views/Config.vue'
import About from '../views/About.vue'
import Dashboard from '../views/Dashboard.vue'
import Snapshots from '../views/LibSnapshots.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/logs',
    name: 'Logs',
    component: Logs,
  },
  {
    path: '/config',
    name: 'Config',
    component: Config,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/snapshots',
    name: 'Snapshots',
    component: Snapshots,
  },
]

const router = new VueRouter({
  routes,
})

export default router
