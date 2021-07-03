<template>
  <span class="number-ticker">
    {{ displayNumber }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AnimatedNumber',

  props: {
    number: {
      type: Number,
      default: 0,
    },
  },

  data: () => {
    return {
      displayNumber: 0,
      interval: 0,
    }
  },

  watch: {
    number() {
      clearInterval(this.interval)

      if (this.number == this.displayNumber) {
        return
      }

      this.interval = window.setInterval(() => {
        if (this.displayNumber != this.number) {
          var change = (this.number - this.displayNumber) / 10
          change = change >= 0 ? Math.ceil(change) : Math.floor(change)
          this.displayNumber = this.displayNumber + change
        }
      }, 20)
    },
  },
})
</script>

<style scoped>
.number-ticker {
  font-weight: 700;
}
</style>
