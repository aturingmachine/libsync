<template>
  <div class="widget-wrapper" :class="classList">
    <div class="widget-header">
      <h3 class="widget-title">{{ headline }}</h3>
      <div class="widget-options-anchor">
        <button
          @click.prevent="optionsOpen = true"
          class="widget-options-button icon"
        >
          <icon>more_vert</icon>
        </button>
        <transition name="global-fade-in">
          <div v-if="optionsOpen" class="widget-options-container">
            <div class="widget-header">
              <h4>{{ headline }} Options</h4>
              <button
                @click.stop="optionsOpen = false"
                class="widget-options-close-button icon close-button"
              >
                <icon>close</icon>
              </button>
            </div>

            <form
              @submit.prevent="updateWidgetConfig"
              class="widget-update-form"
            >
              <slot name="options-form"></slot>
              <div class="option">
                <label for="isVisible">Show Widget?</label>
                <input name="isVisible" type="checkbox" v-model="isVisible" />
              </div>

              <div class="option">
                <label for="isVisible">Widget Size</label>
                <select name="isVisible" type="option" v-model="size">
                  <option v-for="x in sizeOptions" :key="x" :value="x">{{
                    x
                  }}</option>
                </select>
              </div>

              <input class="button submit" type="submit" value="Update" />
            </form>
          </div>
        </transition>
      </div>
    </div>

    <div class="widget-body">
      <slot name="widget-body" />
    </div>
  </div>
</template>

<script lang="ts">
import { Widget, WidgetSize } from '@/store/widgets/models'
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'BaseWidget',

  props: {
    sizeClass: {
      type: String,
    },

    customClasses: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    widget: {
      type: Object as PropType<Widget>,
      required: true,
    },

    title: {
      type: String,
      required: false,
    },
  },

  data: () => {
    return {
      optionsOpen: false,
      isVisible: true,
      size: '',
    }
  },

  computed: {
    classList(): string[] {
      return [...this.customClasses, this.sizeClass]
    },

    headline(): string {
      return this.title || this.widget.name
    },

    sizeOptions(): string[] {
      return Object.keys(WidgetSize)
    },
  },

  methods: {
    handleOptionsClick(): void {
      this.optionsOpen = this.optionsOpen ? false : true
    },

    updateWidgetConfig(): void {
      this.$emit('updateOptions', {
        isVisible: this.isVisible,
        size: this.size,
      })
    },
  },

  watch: {
    widget(): void {
      this.optionsOpen = false
    },
  },

  mounted(): void {
    this.size = this.widget.configuration.size
  },
})
</script>

<style lang="scss" scoped>
.base-widget-wrapper {
  display: flex;
}
</style>
