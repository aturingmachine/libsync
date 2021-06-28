<template>
  <div class="config-wrapper">
    <h2>Environment Configuration</h2>
    <form @submit.prevent="updateConfig()" class="config-form">
      <h3>Library Directories</h3>
      <label for="src">Source Library</label>
      <input name="src" type="text" v-model="localConfig.srcDir" />

      <label for="dest">Destination Library</label>
      <input name="dest" type="text" v-model="localConfig.destDir" />

      <label for="backup">Backup Library</label>
      <input name="backup" type="text" v-model="localConfig.backupDir" />

      <h3>Log Directories</h3>
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

      <h3>Library Watcher Settings</h3>
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

      <input
        :disabled="shouldDisableSubmit"
        type="submit"
        value="Update Configuration"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { EnvConfig } from '@/models/config'
import { ConfigStoreTypes } from '@/store/config'
import { deepInequals } from '@/utils/deep-equals'
import Vue from 'vue'
export default Vue.extend({
  name: 'EnvConfig',

  data: () => {
    return {
      localConfig: {},
    }
  },

  computed: {
    hasConfigLoaded(): boolean {
      return this.$store.getters[ConfigStoreTypes.getters.HasEnvConfigLoaded]
    },

    isConfigUpdating(): boolean {
      return this.$store.getters[ConfigStoreTypes.getters.IsEnvConfigUpdating]
    },

    envConfig(): EnvConfig {
      return this.$store.getters[ConfigStoreTypes.getters.GetEnvConfig]
    },

    hasCopiedConfig(): boolean {
      return Object.keys(this.localConfig).length > 0
    },

    disableInputs(): boolean {
      return !this.hasConfigLoaded || this.isConfigUpdating
    },

    isDirty(): boolean {
      return deepInequals(this.envConfig, this.localConfig)
    },

    shouldDisableSubmit(): boolean {
      return !this.hasConfigLoaded || this.isConfigUpdating || !this.isDirty
    },
  },

  watch: {
    envConfig() {
      this.copyConfig()
    },
  },

  mounted(): void {
    this.copyConfig()
    this.getConfig()
  },

  methods: {
    getConfig(): void {
      this.$store.dispatch(ConfigStoreTypes.actions.GetEnvConfig)
    },

    copyConfig(): void {
      if (this.envConfig) {
        this.localConfig = JSON.parse(JSON.stringify(this.envConfig))
      }
    },

    updateConfig(): void {
      this.$store.dispatch(
        ConfigStoreTypes.actions.UpdateEnvConfig,
        this.localConfig
      )
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

.config-description {
  max-width: 600px;
}

.config-form {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  align-items: flex-start;
}

.config-form > input {
  width: 100%;
  margin-bottom: 10px;
}

.config-form > input[type='checkbox'] {
  width: auto;
}

.config-description {
  text-align: left;
}

caption {
  text-align: left;
  border-left: 5px solid gray;
  background-color: lightgray;
  padding: 10px;
  margin-bottom: 16px;
}
</style>
