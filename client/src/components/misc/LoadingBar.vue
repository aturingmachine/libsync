<template>
  <div class="loading-bar">
    <transition name="loading-bar-fade">
      <div v-show="shouldShow" class="loading-indicator"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { RootGetterTypes } from '@/store'
import { ConfigStoreTypes } from '@/store/config'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import Vue from 'vue'

export default Vue.extend({
  name: 'LoadingBar',

  computed: {
    shouldShow(): boolean {
      return (
        this.$store.getters[ConfigStoreTypes.getters.IsConfigUpdating] ||
        this.$store.getters[ConfigStoreTypes.getters.IsConfigLoading] ||
        this.$store.getters[RootGetterTypes.IsLoading] ||
        this.$store.getters[WidgetStoreTypes.getters.AnyWidgetUpdating] ||
        this.$store.getters[WidgetStoreTypes.getters.AnyWidgetUpdating]
      )
    },
  },
})
</script>

<style>
.loading-bar {
  width: 100%;
  height: 5px;
  overflow: hidden;
}

.loading-indicator {
  width: 20%;
  height: 100%;
  background-color: #65dda7;
  animation: loading-bar-slide 3s infinite, loading-bar-flex 3.2s infinite;
  margin-left: 50%;
}

.loading-bar-fade-enter-active,
.loading-bar-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.loading-bar-fade-enter,
.loading-bar-fade-leave-to {
  opacity: 0;
}

@keyframes loading-bar-slide {
  from {
    margin-left: -20%;
  }

  to {
    margin-left: 100%;
  }
}

@keyframes loading-bar-flex {
  from {
    transform: scaleX(100%);
    background-color: #65dda7;
  }

  25% {
    transform: scaleX(20%);
    background-color: #42b983;
  }

  50% {
    transform: scaleX(100%);
    background-color: #42b983;
  }

  75% {
    transform: scaleX(60%);
    background-color: #65dda7;
  }

  to {
    transform: scaleX(100%);
    background-color: #65dda7;
  }
}
</style>
