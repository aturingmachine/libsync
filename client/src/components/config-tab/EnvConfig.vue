<template>
  <div class="config-wrapper">
    <h2>Environment Configuration</h2>
    <form
      v-if="!!localConfig && !!localConfig.options"
      @submit.prevent="updateConfig()"
      class="config-form"
    >
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
        disabled
        name="combinedLogs"
        type="text"
        v-model="localConfig.combinedLogsOutputDir"
      />

      <label for="errorLogs">Error Logs File</label>
      <input
        disabled
        name="errorLogs"
        type="text"
        v-model="localConfig.errorLogsOutputdir"
      />

      <h3>Library Watcher Settings</h3>
      <caption>
        These settings will change how the file watcher behaves. Upon saving
        these values will modify the current running instance of LibSync as well
        as saving the new values to your configuration.
      </caption>
      <label for="debounceAmount">Debounce Amount (ms)</label>
      <input
        name="debounceAmount"
        type="number"
        v-model.number="localConfig.debounceAmount"
      />

      <label for="rezAttempts">Rez Attempts</label>
      <input
        name="rezAttempts"
        type="number"
        v-model.number="localConfig.rezAttempts"
      />

      <label for="rezCooldown">Rez Cooldown (ms)</label>
      <input
        name="rezCooldown"
        type="number"
        v-model.number="localConfig.rezCooldown"
      />

      <h3>Configuration Options</h3>
      <caption>
        Not all options will have an effect on a currently running instance of
        LibSync.
      </caption>
      <div class="options-grid">
        <div class="option">
          <label class="checkbox-label" for="backup-opt"
            >Will Run Backups
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="backup-opt"
              type="checkbox"
              v-model="localConfig.options.runBackUp"
            />
            <tooltip
              msg="Will run a backup of the destination directory before each sync."
            />
          </span>
        </div>

        <div class="option">
          <label class="checkbox-label" for="debug-opt">
            Run In Debug Mode
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="debug-opt"
              type="checkbox"
              v-model="localConfig.options.isDebug"
            />
            <tooltip msg="Increases the allowed log level." />
          </span>
        </div>

        <div class="option">
          <label class="checkbox-label" for="headless-opt"
            >Run In Headless Mode
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="headless-opt"
              type="checkbox"
              v-model="localConfig.options.isHeadless"
            />
            <tooltip msg="Run LibSync without the API or Client enabled." />
          </span>
        </div>

        <div class="option">
          <label class="checkbox-label" for="plan-opt">
            Run In Plan Mode
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="plan-opt"
              type="checkbox"
              v-model="localConfig.options.isPlan"
            />
            <tooltip
              msg="Will output changes of a sync run without committing them."
            />
          </span>
        </div>

        <div class="option">
          <label class="checkbox-label" for="run-once-opt">
            Run Once
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="run-once-opt"
              type="checkbox"
              v-model="localConfig.options.runOnce"
            />
            <tooltip msg="Will run LibSync once, then exit." />
          </span>
        </div>

        <div class="option">
          <label class="checkbox-label" for="sync-on-start-opt">
            Sync On Start
          </label>
          <span class="checkbox-tooltip-holder">
            <input
              :disabled="disableInputs"
              name="sync-on-start-opt"
              type="checkbox"
              v-model="localConfig.options.syncOnStart"
            />
            <tooltip
              msg="If true LibSync will run a sync job on startup when run non-headless."
            />
          </span>
        </div>
      </div>

      <div class="form-footer">
        <input
          class="button secondary-button fluffy"
          :disabled="shouldDisableSubmit"
          type="button"
          @click.prevent="copyConfig()"
          value="Reset Configuration"
        />
        <input
          class="button submit fluffy"
          :disabled="shouldDisableSubmit"
          type="submit"
          value="Update Configuration"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { EnvConfig } from '@/models/config'
import { ConfigStoreTypes } from '@/store/config'
import { deepInequals } from '@/utils/deep-equals'
import Vue from 'vue'
import Tooltip from '@/components/misc/Tooltip.vue'

export default Vue.extend({
  name: 'EnvConfig',

  components: {
    Tooltip,
  },

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
      return this.$store.getters[ConfigStoreTypes.getters.IsConfigUpdating]
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

<style scoped lang="scss">
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
</style>
