<template>
  <section class="widget-ordering">
    <transition-group name="flip-list" class="reorder-list" tag="div">
      <div
        class="reorder-widget"
        v-for="(orderedWidget, index) in widgetOrdering"
        :key="orderedWidget.widget.name + orderedWidget.widget.auxId"
      >
        <div class="reorder-widget-index">
          {{ index }}
        </div>
        <div class="reorder-widget-body">
          {{ orderedWidget.widget.name }} -
          {{ orderedWidget.widget.auxId }}
        </div>
        <div class="reorder-widget-actions">
          <button
            class="icon"
            :disabled="index === widgetOrdering.length - 1"
            @click="moveWidgetDown(orderedWidget, index)"
          >
            <icon>expand_more</icon>
          </button>
          <button
            class="icon"
            :disabled="index === 0"
            @click="moveWidgetUp(orderedWidget, index)"
          >
            <icon>expand_less</icon>
          </button>
        </div>
      </div>
    </transition-group>
    <div class="reorder-list-actions-wrapper">
      <div class="reorder-list-actions-content">
        <h4>Widget Order</h4>
        <caption>
          <em>Reorder the widgets on the dashboard.</em
          ><br /><br />
          The dashboard renders widgets left to right with the lowest index
          being in the top left, and the highest being in the bottom right.
        </caption>

        <div class="button-container">
          <button
            @click="update()"
            :disabled="shouldDisableButton"
            class="submit"
          >
            Update
          </button>
          <button
            @click="reset()"
            :disabled="shouldDisableButton"
            class="destructive"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { WidgetOrdering } from '@/models/widgets'
import { Widget } from '@/store/widgets/models'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import Vue from 'vue'

export default Vue.extend({
  name: 'WidgetOrdering',

  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },

  data: () => {
    return {
      widgetOrdering: [] as WidgetOrdering[],
    }
  },

  computed: {
    widgets(): Widget[] {
      return this.$store.getters[WidgetStoreTypes.getters.GetWidgets]
    },

    shouldDisableButton(): boolean {
      return (
        !this.widgetOrdering.some((w, index) => w.index !== index) ||
        this.$store.getters[WidgetStoreTypes.getters.IsConfigUpdating]
      )
    },
  },

  watch: {
    widgets(): void {
      this.initWidgetOrders()
    },
  },

  methods: {
    close(): void {
      this.$emit('close')
    },

    initWidgetOrders(force?: boolean): void {
      if (!this.widgetOrdering.length || force) {
        this.widgetOrdering = this.widgets.map((widget, index) => ({
          index,
          widget,
        }))
      }
    },

    reset(): void {
      this.initWidgetOrders(true)
    },

    update(): void {
      this.$store
        .dispatch(WidgetStoreTypes.actions.UpdateWidgetOrder, {
          orderedWidgets: this.widgetOrdering,
        })
        .then(() => this.initWidgetOrders(true))
    },

    moveWidgetUp(widgetOrdering: WidgetOrdering, index: number): void {
      const targetIndex = index - 1
      const currentWidgetAtIndex = this.widgetOrdering[targetIndex]
      const head = this.widgetOrdering.slice(0, targetIndex)
      const tail = this.widgetOrdering.slice(index + 1)

      this.widgetOrdering = [
        ...head,
        widgetOrdering,
        currentWidgetAtIndex,
        ...tail,
      ]
    },

    moveWidgetDown(widgetOrdering: WidgetOrdering, index: number): void {
      const targetIndex = index + 1
      const currentWidgetAtIndex = this.widgetOrdering[targetIndex]
      const head = this.widgetOrdering.slice(0, index)
      const tail = this.widgetOrdering.slice(targetIndex + 1)

      this.widgetOrdering = [
        ...head,
        currentWidgetAtIndex,
        widgetOrdering,
        ...tail,
      ]
    },
  },

  mounted(): void {
    this.initWidgetOrders()
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.widget-ordering {
  display: flex;
  width: 100%;
  justify-content: space-around;

  .reorder-list {
    width: 70%;
  }
}

.reorder-list-actions-wrapper {
  width: 20%;

  .reorder-list-actions-content {
    position: sticky;
    top: 0;

    h4 {
      margin-top: 0;
    }

    caption {
      display: block;
    }

    .button-container {
      display: flex;
      flex-direction: column;

      button {
        margin-top: 10px;
      }
    }
  }
}

.reorder-widget {
  display: flex;
  height: 40px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border: 1px solid $border-primary;
  margin: 4px 0;
  border-radius: 5px;
  background-color: $tertiary;

  .reorder-widget-index {
    width: 5%;
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .reorder-widget-body {
    width: 45%;
    text-align: left;
    height: 100%;
    align-items: center;
    display: flex;
  }

  .reorder-widget-actions {
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    align-items: center;

    // button {
    //   border: none;
    //   background: transparent;
    //   border-radius: 50%;
    //   align-items: center;
    //   justify-content: center;
    //   display: flex;
    //   padding: 0;
    //   height: 36px;
    //   width: 36px;
    //   color: $text-primary;

    //   &:hover {
    //     color: $text-accent;
    //     // background-color: $tertiary;
    //   }

    //   &:disabled {
    //     color: $text-secondary;
    //   }
    // }
  }
}

.flip-list-move {
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
