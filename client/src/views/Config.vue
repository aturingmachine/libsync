<template>
  <div class="config-wrapper">
    <h2>LibSync Configuration</h2>
    <form @submit.prevent="updateConfig()" class="config-form">
      <label for="src">Source Library</label>
      <input name="src" type="text" v-model="localConfig.srcDir" />

      <label for="dest">Destination Library</label>
      <input name="dest" type="text" v-model="localConfig.destDir" />

      <label for="backup">Backup Library</label>
      <input name="backup" type="text" v-model="localConfig.backupDir" />

      <label for="combinedLogs">Combined Logs File</label>
      <input
        name="combinedLogs"
        type="text"
        v-model="localConfig.combinedLogsOutputDir"
      />

      <label for="errorLogs">Error Logs File</label>
      <input
        name="errorLogs"
        type="text"
        v-model="localConfig.errorLogsOutputdir"
      />

      <label for="debounceAmount">Debounce Amount</label>
      <input
        name="debounceAmount"
        type="number"
        v-model="localConfig.debounceAmount"
      />

      <label for="rezAttempts">Rez Attempts</label>
      <input
        name="rezAttempts"
        type="number"
        v-model="localConfig.rezAttempts"
      />

      <label for="rezCooldown">Rez Cooldown</label>
      <input
        name="rezCooldown"
        type="number"
        v-model="localConfig.rezCooldown"
      />

      <input type="submit" />
    </form>
  </div>
</template>

<script lang="ts">
import { Config } from '@/models/config'
import Vue from 'vue'
export default Vue.extend({
  name: 'Config',

  data: () => {
    return {
      localConfig: {},
    }
  },

  computed: {
    hasConfigLoaded(): boolean {
      return this.$store.getters['config/HasConfigLoaded']
    },

    isConfigUpdating(): boolean {
      return this.$store.getters['config/IsConfigUpdating']
    },

    config(): Config {
      return this.$store.getters['config/GetConfig']
    },
  },

  watch: {
    config() {
      this.copyConfig()
    },
  },

  mounted(): void {
    this.copyConfig()
    this.getConfig()
  },

  methods: {
    getConfig(): void {
      this.$store.dispatch('config/GetConfig')
    },

    copyConfig(): void {
      this.localConfig = { ...this.config }
    },

    updateConfig(): void {
      this.$store.dispatch('config/UpdateConfig', this.config)
    },
  },
})
</script>

<style scoped>
.config-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  align-items: center;
}

.config-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: flex-start;
}

.config-form > input {
  width: 100%;
  margin-bottom: 10px;
}
</style>
