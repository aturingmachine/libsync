<template>
  <span class="material-icons"><slot></slot></span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MaterialIcon',
})
</script>

<style lang="scss">
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';

  &.inline-icon {
    height: 100%;
    font-size: inherit;
  }
}
</style>
