<template>
  <div class="config-wrapper">
    <h2>Runtime Configuration</h2>
    <p class="config-description">
      This is the evaluated configuration for the <b>current</b> running
      instance of LibSync. These values are determined by evaluating the
      configuration set in <code>config.json</code> (known as EnvConfig), and
      the command line arguments passed to LibSync. Command Line Arguments will
      always be prioritized over static configuration files. Due to this,
      changes made here will only effect the current run of LibSync. More
      permanent changes can be implemented by using <code>config.json</code> in
      tandem with changes to Command Line Arguments.
    </p>
    <form
      @submit.prevent="updateConfig()"
      v-if="hasCopiedConfig"
      class="config-form"
    >
      <h3>Configured Directories</h3>
      <label for="src-path">Source Library Path</label>
      <input
        :disabled="disableInputs"
        name="src-path"
        type="text"
        v-model="localConfig.dirs.src"
      />

      <label for="dest-path">Destination Library Path</label>
      <input
        :disabled="disableInputs"
        name="dest-path"
        type="text"
        v-model="localConfig.dirs.dest"
      />

      <label for="backup=path">Backup Library Path</label>
      <input
        :disabled="disableInputs"
        name="backup=path"
        type="text"
        v-model="localConfig.dirs.backup"
      />

      <h3>Parsed Library Roots</h3>
      <caption>
        This is the current determined root directory of the library. These are
        determined by finding the lowest common path-piece for the given
        libraries. Currently determined programmatically and included for
        debugging purposes. Will be configurable in a later update.
      </caption>
      <label for="src-lib">Source Library Name</label>
      <input
        disabled
        name="src-lib"
        type="text"
        v-model="localConfig.libs.src"
      />

      <label for="dest-lib">Destination Library Name</label>
      <input
        disabled
        name="dest-lib"
        type="text"
        v-model="localConfig.libs.dest"
      />

      <label for="backup-lib">Backup Library Name</label>
      <input
        disabled
        name="backup-lib"
        type="text"
        v-model="localConfig.libs.backup"
      />

      <h3>Configured Runtime Options</h3>
      <caption>
        Not all included options can be changed while LibSync is running.
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
      </div>

      <div class="form-footer">
        <input
          class="button secondary-button"
          :disabled="shouldDisableSubmit"
          type="button"
          @click.prevent="copyConfig()"
          value="Reset Configuration"
        />
        <input
          class="button submit-button"
          :disabled="shouldDisableSubmit"
          type="submit"
          value="Update Configuration"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ConfigStoreTypes } from '@/store/config'
import { deepInequals } from '@/utils/deep-equals'
import { RuntimeConfig } from '@/models/config'
import Tooltip from '@/components/misc/Tooltip.vue'

export default Vue.extend({
  name: 'RuntimeConfig',

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
      return this.$store.getters[
        ConfigStoreTypes.getters.HasRuntimeConfigLoaded
      ]
    },

    isConfigUpdating(): boolean {
      return this.$store.getters[ConfigStoreTypes.getters.IsConfigUpdating]
    },

    runtimeConfig(): RuntimeConfig {
      return this.$store.getters[ConfigStoreTypes.getters.GetRuntimeConfig]
    },

    hasCopiedConfig(): boolean {
      return Object.keys(this.localConfig).length > 0
    },

    disableInputs(): boolean {
      return !this.hasConfigLoaded || this.isConfigUpdating
    },

    isDirty(): boolean {
      return deepInequals(this.runtimeConfig, this.localConfig)
    },

    shouldDisableSubmit(): boolean {
      return !this.hasConfigLoaded || this.isConfigUpdating || !this.isDirty
    },
  },

  watch: {
    hasConfigLoaded() {
      this.copyConfig()
    },
  },

  mounted(): void {
    this.getConfig()
    this.copyConfig()
  },

  methods: {
    getConfig(): void {
      this.$store.dispatch(ConfigStoreTypes.actions.GetRuntimeConfig)
    },

    copyConfig(): void {
      if (this.runtimeConfig) {
        this.localConfig = JSON.parse(JSON.stringify(this.runtimeConfig))
      }
    },

    updateConfig(): void {
      this.$store.dispatch(
        ConfigStoreTypes.actions.UpdateRuntimeConfig,
        this.localConfig
      )
    },
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/colors.scss';

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
