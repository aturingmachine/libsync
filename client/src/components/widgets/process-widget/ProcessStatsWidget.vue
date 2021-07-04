<template>
  <base-widget
    ref="baseWidget"
    :sizeClass="sizeClass"
    :widget="widget"
    @updateOptions="dispatchUpdate"
  >
    <template v-slot:options-form> </template>

    <template v-slot:widget-body>
      <process-stats-chart
        v-if="dataPoint === 'cpu'"
        ref="cpuChart"
        :height="200"
        :width="100"
        :chart-data="cpuChartData"
        :conf="cpuChart"
      />
      <process-stats-chart
        v-if="dataPoint === 'mem'"
        ref="memChart"
        :height="200"
        :width="100"
        :chart-data="memChartData"
        :conf="memChart"
      />
    </template>
  </base-widget>
</template>

<script lang="ts">
import { UpdateWidgetActionPayload, WidgetBaseUpdate } from '@/models/config'
import { Stat } from '@/models/process-stat'
import { ProcessWebSocket } from '@/services/websocket'
import { RootGetterTypes } from '@/store'
import { ProcessStoreTypes } from '@/store/process'
import { Widget, WidgetConfig } from '@/store/widgets/models'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import Vue, { PropType } from 'vue'
import BaseWidget from '../BaseWidget.vue'
import ProcessStatsChart from './ProcessStatsChart.vue'
import { ChartConfiguration, ChartData, LinearScale } from 'chart.js'

export default Vue.extend({
  name: 'ProcessStatsWidget',

  components: {
    BaseWidget,
    ProcessStatsChart,
  },

  props: {
    sizeClass: {
      type: String,
    },

    widget: {
      type: Object as PropType<Widget>,
      required: true,
    },

    dataPoint: {
      type: String,
    },
  },

  data: () => {
    return {
      localConfig: {} as WidgetConfig,
      memLabel: '',
    }
  },

  computed: {
    isLocked(): boolean {
      return this.$store.getters[RootGetterTypes.IsLocked]
    },

    statsHistory(): Stat[] {
      return [
        ...(this.$store.getters[
          ProcessStoreTypes.getters.GetProcessStats
        ] as Stat[]),
      ]
        .reverse()
        .slice(0, 10)
    },

    cpuHistory(): number[] {
      return this.statsHistory.map(s => Math.abs(s.cpu))
    },

    memoryHistory(): number[] {
      return this.statsHistory.map(s => {
        let fileSizeInBytes = s.memory
        let i = -1
        const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB']
        do {
          fileSizeInBytes = fileSizeInBytes / 1024
          i++
        } while (fileSizeInBytes > 1024)

        this.memLabel = byteUnits[i]
        return Math.max(fileSizeInBytes, 0.1)
      })
    },

    ctimeHistory(): number[] {
      return this.statsHistory.map(s => s.ctime)
    },

    cpuChart(): ChartConfiguration {
      return {
        type: 'line',
        data: this.cpuChartData,
        options: {
          animation: {
            duration: 1000,
            easing: 'easeInOutCirc',
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            type: 'linear',
            xAxes: [
              {
                ticks: {
                  reverse: true,
                  min: 0,
                  fontColor: '#a3a29f',
                },
                gridLines: {
                  color: '#a3a29f',
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  min: 0,
                  minor: {
                    autoSkip: true,
                  },
                  fontColor: '#a3a29f',
                  maxTicksLimit: 7,
                },
                gridLines: {
                  color: '#a3a29f',
                },
              },
            ],
          },
          plugins: {
            legend: {
              display: true,
              reverse: true,
            },
          },
        },
      }
    },

    memChart(): ChartConfiguration {
      return {
        type: 'line',
        data: this.memChartData,
        options: {
          animation: {
            duration: 1000,
            easing: 'easeInOutCirc',
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            type: 'linear',
            xAxes: [
              {
                ticks: {
                  reverse: true,
                  min: 0,
                  fontColor: '#a3a29f',
                },
                gridLines: {
                  color: '#a3a29f',
                },
              },
            ],
            yAxes: [
              {
                type: 'linear',
                gridLines: {
                  color: '#a3a29f',
                },
                ticks: {
                  fontColor: '#a3a29f',
                  callback: (
                    value: string,
                    index: number,
                    values: string[]
                  ) => {
                    return value + this.memLabel
                  },
                  maxTicksLimit: 6,
                },
              },
            ],
          } as LinearScale,
          plugins: {
            legend: {
              display: true,
              reverse: true,
            },
          },
        },
      }
    },

    cpuChartData(): ChartData {
      return {
        labels: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        datasets: [
          {
            type: 'line',
            label: 'CPU',
            data: this.cpuHistory,
            borderColor: '#2f9c78',
            fill: false,
            cubicInterpolationMode: 'monotone',
          },
        ],
      }
    },

    memChartData(): ChartData {
      return {
        labels: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        datasets: [
          {
            label: 'MEM',
            data: this.memoryHistory,
            borderColor: '#cf5d93',
            fill: false,
            cubicInterpolationMode: 'monotone',
          },
        ],
      }
    },
  },

  methods: {
    copyConfig(): void {
      this.localConfig = {
        ...this.widget.configuration,
        customOptions: { ...this.widget.configuration.customOptions },
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
          const refs = this.$refs as Record<string, Vue>
          refs.baseWidget.$data.optionsOpen = false
          ;(refs.cpuChart as Record<string, any>).makeChart()
        })
    },

    pushStats(ev: MessageEvent<any>): void {
      this.$store.dispatch(ProcessStoreTypes.actions.GetProcessStats, {
        stats: JSON.parse(ev.data),
      })
    },
  },

  mounted(): void {
    this.copyConfig()
    ProcessWebSocket.addStatusHandler(this.pushStats)
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
