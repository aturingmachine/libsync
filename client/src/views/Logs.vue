<template>
  <div class="logs-page">
    <h1>hello</h1>
    <transition-group name="list" tag="div" class="list-transition">
      <log-row v-for="log in logs" :key="log.id" class="list-item" :log="log" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Log } from '../models/logs'
import { LogsWebSocket } from '../services/websocket'
import LogRow from '../components/LogRow.vue'
import { LogsGetters, LogsMutations } from '@/store/logs'

export default Vue.extend({
  name: 'Logs',

  components: {
    LogRow,
  },

  computed: {
    logs(): Log[] {
      return this.$store.getters[LogsGetters.GetLogs] as Log[]
    },
  },

  methods: {
    addLogs(logs: Log[]): void {
      this.$store.commit({ type: LogsMutations.AddLogs, logs })
    },
  },

  mounted(): void {
    this.$store.dispatch('logs/InitLogs')
    // LogsWebSocket.addMessageHandler('log-view-mounted', ev => {
    //   this.addLogs(JSON.parse(ev.data))
    // })
  },
})
</script>

<style scoped>
.list-transition {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list-item {
  transition: all 0.5s;
  display: inline-flex;
  margin-right: 10px;
  width: 100%;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: scale(60%);
}
.list-leave-active {
  position: absolute;
}
</style>
