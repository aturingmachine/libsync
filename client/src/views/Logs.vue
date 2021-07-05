<template>
  <div class="page logs-page">
    <div class="logs-header">
      <div class="search-holder">
        <transition name="label-slide">
          <label
            class="search-label"
            for="log-search"
            v-show="hasSearchTerm || isSearching"
          >
            Filtered Logs: <animated-number :number="filteredLogs.length" />
          </label>
        </transition>
        <div class="search-input">
          <input
            class="log-search"
            name="log-search"
            placeholder="Filter Logs"
            v-model="searchTerm"
            @input.prevent="debounceTermUpdate()"
            @focus="isSearching = true"
            @blur="isSearching = false"
          />
          <transition name="button-twist">
            <button
              class="search-clear-button"
              v-show="hasSearchTerm"
              @click="clearSearch()"
            >
              &#10006;
            </button>
          </transition>
        </div>
      </div>
    </div>
    <transition-group name="list" tag="div" class="list-transition">
      <log-row
        v-for="log in filteredLogs"
        :key="log.id"
        class="list-item"
        :log="log"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Log } from '../models/logs'
import LogRow from '../components/logs/LogRow.vue'
import AnimatedNumber from '../components/misc/AnimatedNumber.vue'
import { LogsGetters, LogsMutations } from '@/store/logs'
import { debounce } from '@/utils/debounce'

export default Vue.extend({
  name: 'Logs',

  components: {
    AnimatedNumber,
    LogRow,
  },

  data: () => {
    return {
      isSearching: false,
      searchTerm: '',
      otherSearchTerm: '',
      debouncedUpdate: () => Promise.resolve(),
    }
  },

  computed: {
    logs(): Log[] {
      return this.$store.getters[LogsGetters.GetLogs] as Log[]
    },

    filteredLogs(): Log[] {
      return this.$store.getters['logs/filteredLogs'](this.otherSearchTerm)
    },

    hasSearchTerm(): boolean {
      return this.searchTerm.length > 0
    },
  },

  methods: {
    addLogs(logs: Log[]): void {
      this.$store.commit({ type: LogsMutations.AddLogs, logs })
    },

    debounceTermUpdate(): void {
      this.debouncedUpdate()
    },

    updateTerm(): void {
      this.otherSearchTerm = this.searchTerm
    },

    clearSearch(): void {
      this.searchTerm = ''
      this.updateTerm()
    },
  },

  mounted(): void {
    this.$store.dispatch('logs/InitLogs')
    this.debouncedUpdate = debounce(() => this.updateTerm(), 400)
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

.logs-page {
  width: 100%;
}

.logs-header {
  margin-bottom: 24px;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 64px;
}

.search-holder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 60%;
}

.search-input {
  width: 100%;
  background-color: rgb(65, 92, 117);
  border: 1px solid;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid rgb(153, 153, 152);
  padding: 0 8px;
  box-sizing: border-box;
}

.search-input:focus-within {
  border: solid 2px $border-highlight;
}

.log-search {
  width: 100%;
  height: 16px;
  border-radius: 15px;
  padding: 8px;
  font-weight: 700;
  font-family: Roboto;
  letter-spacing: 0.15em;
  border: none;
}

.log-search:active {
  outline: none;
}

.log-search:focus {
  outline: none;
}

.search-label {
  position: absolute;
  top: 85px;
  font-weight: 700;
  font-size: 18px;
}

.search-clear-button {
  color: $text-accent;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}

.log-count {
  margin-bottom: 4px;
}

.search-clear-button:hover {
  background-color: lightgray;
}

.list-transition {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list-item {
  transition: all 0.5s;
  display: inline-flex;
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

.label-slide-enter-active,
.label-slide-leave-active {
  transition: all 0.1s ease-in-out;
}

.label-slide-enter,
.label-slide-leave-to {
  opacity: 0;
  transform: translateY(25px);
}

.button-twist-enter-active,
.button-twist-leave-active {
  transition: all 0.1s ease-in-out;
}

.button-twist-enter,
.button-twist-leave-to {
  opacity: 0;
  transform: skew(80deg, 10deg) rotate(90deg);
}
</style>
