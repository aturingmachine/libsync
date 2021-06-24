<template>
  <div class="logs-page">
    <h1>hello</h1>
    <transition-group name="list" tag="div" class="list-transition">
      <log-row
        v-for="log in getLogs"
        :key="log.id"
        class="list-item"
        :log="log"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Log } from '../models/logs'
import { LogsStore } from '../store/logs'
import { LogsWebSocket } from '../services/websocket'
import LogRow from '../components/LogRow.vue'

@Component({
  components: {
    LogRow,
  },
})
export default class LogPage extends Vue {
  @LogsStore.Getter getLogs!: Log[]
  @LogsStore.Mutation addLogs!: (logs: Log[]) => void

  arr = new Array(50).fill('').map((x, i) => {
    return { t: Math.random(), i }
  })

  someFunction(): void {
    this.arr = [{ t: Math.random(), i: this.arr.length }, ...this.arr]
  }

  mounted(): void {
    LogsWebSocket.addMessageHandler('mounted log test', (ev) => {
      this.addLogs(JSON.parse(ev.data))
    })
  }
}
</script>

<style scoped>
.list-transition {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list-item {
  transition: all 0.2s;
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
