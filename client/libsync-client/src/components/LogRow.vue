<template>
  <div class="logs-row-wrapper">
    <div class="log-row-content">
      <div class="log-level">
        {{ log.level }}
      </div>
      <div class="log-content">
        {{ new Date(log.timestamp).toLocaleString() }} | {{ log.func }} |
        {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Log } from '../models/logs'

@Component({})
export default class LogRow extends Vue {
  isOpen = false
  @Prop()
  log!: Log
}
</script>

<style scoped>
.logs-row-wrapper {
  display: flex;
  margin: 6px 0;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 600;
  text-align: left;
}

.log-row-content {
  display: flex;
  width: 100%;
  margin: 4px;
  align-items: center;
}

.log-level {
  border: 1px solid black;
  padding: 4px;
  height: 100%;
  flex-basis: 6%;
  display: flex;
  align-items: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.log-content {
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid black;
  border-left: none;
  flex-basis: 94%;
  max-width: 90%;
  height: 100%;
  align-items: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
