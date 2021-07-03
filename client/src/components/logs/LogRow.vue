<template>
  <div class="log-row-wrapper">
    <div class="log-content">
      <div class="log-row-content" @click="isOpen = !isOpen">
        <div class="log-level" :class="`${log.level} ${openClass}`">
          {{ log.level }}
        </div>
        <div class="log-short-details">
          <p class="log-message">
            {{ new Date(log.timestamp).toLocaleString() }} | {{ log.func }} |
            {{ log.message }}
          </p>
          <span class="arrow" :class="openClass"> &#9650;</span>
        </div>
      </div>
      <transition name="expand">
        <div v-if="isOpen" class="log-details">
          <log-details :log="log" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Log } from '../../models/logs'
import Vue, { PropType } from 'vue'
import LogDetails from './LogDetails.vue'

export default Vue.extend({
  name: 'LogRow',
  components: {
    LogDetails,
  },
  data: () => {
    return {
      isOpen: false,
    }
  },
  computed: {
    openClass(): string {
      return this.isOpen ? 'open' : 'close'
    },
  },
  props: {
    log: {
      type: Object as PropType<Log>,
    },
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

.log-row-wrapper {
  display: flex;
  font-weight: 600;
  text-align: left;
  justify-content: center;
  box-sizing: border-box;
  margin: 6px 0;
}

.log-content {
  display: flex;
  width: 97%;
  border: 1px solid $border-primary;
  border-radius: 10px;
  transition: box-shadow 0.2s ease-in-out;
  flex-direction: column;

  &:hover {
    box-shadow: rgb(37, 46, 54) 3px 3px 3px 3px;
  }
}

.log-row-content {
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}

.arrow {
  transition: all 0.3s ease-in-out;

  &.open {
    transform: scaleY(-1);
  }
}

.log-level {
  height: 100%;
  display: flex;
  align-items: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  min-width: 8%;
  border-right: 1px solid $border-primary;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: all 0.3s ease-in-out;
  justify-content: center;

  &.open {
    border-bottom-left-radius: 0px;
  }

  &.info {
    background-color: $log-info;
  }

  &.error {
    background-color: $log-error;
  }

  &.debug {
    background-color: $log-debug;
  }

  &.verbose {
    background-color: $log-verbose;
  }
}

.log-short-details {
  display: flex;
  flex-basis: 94%;
  max-width: 90%;
  height: 100%;
  margin: 4px;
  justify-content: space-between;
  align-items: center;
}

.log-message {
  display: inline-block;
  border-left: none;
  align-items: center;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  word-wrap: break-word;
  padding-left: 8px;
}

.log-details {
  width: 100%;
  height: 100%;
  max-height: 1000px;
  border-top: 1px solid $border-primary;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
}

.expand-enter,
.expand-leave-to {
  max-height: 0px;
  opacity: 0;
}
</style>
