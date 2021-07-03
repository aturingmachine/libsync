<template>
  <div class="tooltip">
    <span class="tooltip-text">
      {{ msg }}
    </span>
    <slot class="tooltip-binder">
      <span class="default-trigger">?</span>
    </slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Tooltip',

  props: {
    msg: {
      type: String,
    },
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltip-text {
  visibility: hidden;
  min-width: 200px;
  background-color: rgb(48, 68, 87);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 4px;
  position: absolute;
  z-index: 1;
  bottom: 30%;
  left: calc(100% + 75px);
  margin-left: -60px;
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.tooltip .tooltip-text::after {
  content: '';
  position: absolute;
  bottom: 8%;
  left: -10px;
  margin-left: -10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent rgb(48, 68, 87) transparent transparent;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-text {
  border: 2px solid rgb(21, 32, 43);
  box-shadow: black 0px 0 10px 1px;
}

.default-trigger {
  padding: 0 6px;
  border-radius: 15px;
  color: $accent;
  background-color: $accent-text;
}
</style>
