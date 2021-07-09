<template>
  <div class="log-json">
    <span class="json-data" v-html="expandedLog"> </span>
  </div>
</template>

<script lang="ts">
import { Log } from '../../models/logs'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'LogDetails',
  props: {
    log: {
      type: Object as PropType<Log>,
    },
  },
  computed: {
    expandedLog(): string {
      return `<span class="json-line">{</span>`
        .concat(this.generateDetailsFromLog(this.log))
        .concat(`<span class="json-line">}</span>`)
    },
  },
  methods: {
    getValClass(val: string | number | boolean | unknown): string {
      const type = typeof val
      switch (type) {
        case 'string':
          return 'string-val'
        case 'number':
          return 'number-val'
        case 'boolean':
          return 'boolean-val'
        default:
          return 'val'
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateDetailsFromLog(obj: any, depth = 1): string {
      return Object.entries(obj)
        .map(([key, value]) => {
          const style = `padding-left: ${depth * 16}px;`
          const keyString = `<b>"${key}": </b>`
          if (!value) {
            return `<span class="json-line" style="${style}">${keyString} <em class="undef-val">undefined</em></span>`
          }

          if (typeof value === 'object') {
            return `<span class="json-line" style="${style}">${keyString} {</span>`
              .concat(this.generateDetailsFromLog(value, depth + 1))
              .concat(`<span class="json-line" style="${style}">}</span>`)
          }
          const wrapperCharacter = typeof value === 'string' ? '"' : ''
          const valueClass = this.getValClass(value)
          const valueString = `<em class="${valueClass}">${wrapperCharacter}${value}${wrapperCharacter}</em>`
          return `<span class="json-line" style="${style}">${keyString} ${valueString}</span>`
        })
        .join('')
    },
  },
})
</script>

<style>
.json-line:nth-child(even) {
  background-color: rgb(30, 41, 52);
}

.json-line {
  margin: 6px 2px;
  color: rgb(232, 230, 227);
  display: flex;
}

.json-line b {
  color: rgb(236, 162, 51);
  margin-right: 6px;
}

.json-line em.string-val {
  font-style: normal;
  color: rgb(224, 112, 112);
}

.json-line em.number-val {
  font-style: normal;
  color: rgb(35, 35, 202);
}

.json-line em.boolean-val {
  font-style: normal;
  color: rgb(25, 165, 25);
}

.json-line em.undef-val {
  font-style: normal;
  color: pink;
}

.json-line em.val {
  font-style: normal;
  color: rgb(173, 38, 173);
}
</style>

<style scoped>
.log-json {
  background-color: rgb(17, 26, 34);
  font-family: monospace;
  font-weight: 500;
  text-align: left;
  padding: 4px;
  font-family: 'Roboto Mono', monospace;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
