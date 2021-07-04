<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue'
import { Line, mixins } from 'vue-chartjs'
import { ChartConfiguration, ChartOptions } from 'chart.js'

export default (Vue as VueConstructor<
  Vue & InstanceType<typeof mixins.reactiveProp> & InstanceType<typeof Line>
>).extend({
  name: 'ProcessStatsChart',
  extends: Line,
  mixins: [mixins.reactiveProp],

  props: {
    overrideOptions: {
      type: Object as PropType<ChartOptions>,
    },
    conf: {
      type: Object as PropType<ChartConfiguration>,
    },
  },

  data: () => {
    return {
      options: {
        // responsive: true,
        plugins: {
          legend: {
            reverse: true,
          },
        },
        min: 0,
      } as ChartOptions,
    }
  },

  computed: {
    parsedOptions(): ChartOptions {
      return { ...this.options, ...this.overrideOptions }
    },
  },

  methods: {
    makeChart(): void {
      if (this.conf.options && this.conf.data) {
        this.renderChart(this.conf.data, this.conf.options)
      }
    },
  },

  mounted(): void {
    console.log(this.conf)
    this.makeChart()
  },
})
</script>

<style lang="scss" scoped>
.process-stats-chart-wrapper {
  display: flex;
}
</style>
