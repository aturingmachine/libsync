<template>
  <base-widget
    ref="baseWidget"
    :sizeClass="sizeClass"
    :widget="widget"
    @updateOptions="dispatchUpdate"
  >
    <template v-slot:options-form>
      <label for="polling-interval">Polling Interval</label>
      <input
        v-if="localConfig.customOptions"
        name="polling-interval"
        type="number"
        v-model.number="localConfig.customOptions.pollingPeriod"
      />

      <div class="option">
        <label for="show-timeline">Show Timeline</label>
        <input
          v-if="localConfig.customOptions"
          name="show-timeline"
          type="checkbox"
          v-model="localConfig.customOptions.showTimeline"
        />
      </div>
    </template>

    <template v-slot:widget-body>
      <div class="widget-body-template" :class="showTimeline ? '' : 'no-graph'">
        <icon
          class="widget-main-icon"
          :class="isLocked ? 'locked' : 'unlocked'"
        >
          {{ isLocked ? 'lock' : 'lock_open' }}
        </icon>
        <div v-if="showTimeline" class="lock-graph">
          <tbody>
            <transition-group name="list" tag="tr" class="list-transition">
              <td
                class="list-item"
                v-for="(data, index) in graphData"
                :key="data.ts"
                :class="data.lockVal ? 'locked' : 'unlocked'"
              >
                <div :class="sizeClass">
                  {{
                    Math.abs(graphData.length - index) *
                      (pollingInterval / 1000)
                  }}s
                </div>
              </td>
            </transition-group>
          </tbody>
        </div>
      </div>
    </template>
  </base-widget>
</template>

<script lang="ts">
import { UpdateWidgetActionPayload, WidgetBaseUpdate } from '@/models/config'
import { RootGetterTypes } from '@/store'
import { Widget, WidgetConfig } from '@/store/widgets/models'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import Vue, { PropType } from 'vue'
import BaseWidget from './BaseWidget.vue'

export default Vue.extend({
  name: 'LockStatusWidget',

  components: {
    BaseWidget,
  },

  props: {
    sizeClass: {
      type: String,
    },

    widget: {
      type: Object as PropType<Widget>,
      required: true,
    },
  },

  data: () => {
    return {
      localConfig: {} as WidgetConfig,
      intervalId: 0,
      graphData: [] as { lockVal: boolean; ts: number }[],
    }
  },

  computed: {
    isLocked(): boolean {
      return this.$store.getters[RootGetterTypes.IsLocked]
    },

    pollingInterval(): number {
      return this.widget.configuration.customOptions?.pollingPeriod as number
    },

    showTimeline(): boolean {
      return !!this.widget.configuration.customOptions?.showTimeline
    },
  },

  methods: {
    copyConfig(): void {
      this.localConfig = {
        ...this.widget.configuration,
        customOptions: { ...this.widget.configuration.customOptions },
      }
    },

    startPolling(): void {
      if (this.showTimeline) {
        this.intervalId = setInterval(
          (() => {
            this.graphData = [
              ...[{ lockVal: this.isLocked, ts: Date.now() }],
              ...[...this.graphData].reverse(),
            ]
              .slice(0, 10)
              .reverse()
          }).bind(this),
          this.pollingInterval
        )
      }
    },

    dispatchUpdate(baseUpdate: WidgetBaseUpdate): void {
      const payload: UpdateWidgetActionPayload = {
        widgetName: this.widget.name,
        configuration: {
          isVisible: baseUpdate.isVisible,
          widget: {
            ...this.widget,
            configuration: {
              ...this.widget.configuration,
              size: baseUpdate.size,
              customOptions: {
                ...this.widget.configuration.customOptions,
                ...this.localConfig.customOptions,
              },
            },
          },
        },
      }

      this.$store
        .dispatch(WidgetStoreTypes.actions.UpdateWidgetConfiguration, payload)
        .then(() => {
          if (payload.configuration.isVisible) {
            const refs = this.$refs as Record<string, Vue>
            refs.baseWidget.$data.optionsOpen = false
            this.startPolling()
          }
        })

      this.clearPoll()
    },

    clearPoll(): void {
      clearInterval(this.intervalId)
    },
  },

  mounted(): void {
    this.copyConfig()
    this.startPolling()
  },

  beforeDestroy(): void {
    this.clearPoll()
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.widget-body-template {
  display: flex;
  justify-content: space-between;
  height: 100%;

  &.no-graph {
    justify-content: center;
  }
}

.locked {
  color: $warning;
  transform: none;
}

.unlocked {
  color: $success;
  transform: none;
}

.lock-graph {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  tbody {
    width: 100%;
  }

  tr {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;

    td {
      height: 100%;
      width: 9%;
      color: white;
      border-left: 1px solid $primary;
      border-right: 1px solid $primary;
      transition: background-color 0.3s ease-in;
      box-sizing: border-box;

      &.locked {
        background-color: $warning;
      }

      &.unlocked {
        background-color: $success;
      }

      div {
        height: 10%;
        width: initial;
        text-align: right;
        margin: 0;
        transform-origin: 100% 50%;
        transform: rotate(90deg);

        &.widget-size-Small {
          display: none;
        }
      }
    }
  }
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
}

.list-leave-active {
  position: absolute;
  opacity: 0;
}
</style>
