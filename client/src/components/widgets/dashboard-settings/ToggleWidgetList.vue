<template>
  <section class="widget-toggle-list">
    <div class="toggle-content">
      <div class="toggle-headers">
        <div>Disabled Widgets</div>
        <div>Enabled Widgets</div>
      </div>
      <transition-group name="flip-list" tag="div" class="widgets">
        <div
          class="widget disabled"
          v-for="widget of localDisabledWidgets"
          :key="widget.name + widget.auxId"
        >
          {{ widget.name + widget.auxId }}
          <button class="move-button icon" @click="move(true, widget)">
            <icon>arrow_forward_ios</icon>
          </button>
        </div>

        <div
          v-if="!localDisabledWidgets.length"
          key="disabled"
          class="empty disabled"
        >
          No disabled widgets
        </div>

        <div
          class="widget enabled"
          v-for="(widget, index) of localEnabledWidgets"
          :key="widget.name + widget.auxId"
          :style="{ 'grid-row-start': index + 1 }"
        >
          {{ widget.name + widget.auxId }}
          <button class="move-button icon" @click="move(false, widget)">
            <icon>arrow_forward_ios</icon>
          </button>
        </div>

        <div
          v-if="!localEnabledWidgets.length"
          key="enabled"
          class="empty enabled"
        >
          No enabled widgets
        </div>
      </transition-group>
    </div>

    <div class="toggle-list-actions-wrapper">
      <div class="toggle-list-actions-content">
        <h4>Enabled Widgets</h4>
        <caption>
          <em>Determine which widgets display on the dashboard.</em
          ><br /><br />
          Widgets that are enabled will show on the dashboard and can be
          configured. Disabled widgets can be re-enabled by visiting this
          settings panel.
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
import { Widget } from '@/store/widgets/models'
import { WidgetStoreTypes } from '@/store/widgets/widget-store'
import Vue from 'vue'

export default Vue.extend({
  name: 'ToggleWidgetList',

  data: () => {
    return {
      localWidgets: [] as Widget[],
      localEnabledWidgets: [] as Widget[],
      localDisabledWidgets: [] as Widget[],
    }
  },

  computed: {
    widgets(): Widget[] {
      return this.$store.getters[WidgetStoreTypes.getters.GetWidgets]
    },

    enabledWidgets(): Widget[] {
      return this.$store.getters[WidgetStoreTypes.getters.GetVisibleWidgets]
    },

    disabledWidgets(): Widget[] {
      return this.widgets.filter(w => !this.enabledWidgets.includes(w))
    },

    shouldDisableButton(): boolean {
      return (
        (this.enabledWidgets.every(w =>
          this.localEnabledWidgets
            .map(x => x.name + x.auxId)
            .includes(w.name + w.auxId)
        ) &&
          this.disabledWidgets.every(w =>
            this.localDisabledWidgets
              .map(x => x.name + x.auxId)
              .includes(w.name + w.auxId)
          )) ||
        this.$store.getters[WidgetStoreTypes.getters.IsConfigUpdating]
      )
    },
  },

  watch: {
    widgets(): void {
      this.copyData()
    },
  },

  methods: {
    copyData(force?: boolean): void {
      if (
        !this.localEnabledWidgets.length ||
        !this.localDisabledWidgets.length ||
        !this.localWidgets.length ||
        force
      ) {
        this.localWidgets = [...this.widgets]
        this.localEnabledWidgets = [...this.enabledWidgets]
        this.localDisabledWidgets = [...this.disabledWidgets]
      }
    },

    move(enabling: boolean, widget: Widget): void {
      console.log('gonna try n move')
      const widgetSource = enabling
        ? this.localDisabledWidgets
        : this.localEnabledWidgets

      const index = widgetSource.findIndex(
        w => w.name === widget.name && w.auxId === widget.auxId
      )

      if (enabling) {
        this.localEnabledWidgets = [...this.localEnabledWidgets, widget]
        this.localDisabledWidgets = [
          ...widgetSource.slice(0, index),
          ...widgetSource.slice(index + 1),
        ]
      } else {
        this.localDisabledWidgets = [...this.localDisabledWidgets, widget]
        this.localEnabledWidgets = [
          ...widgetSource.slice(0, index),
          ...widgetSource.slice(index + 1),
        ]
      }
    },

    reset(): void {
      this.copyData(true)
    },

    update(): void {
      this.$store
        .dispatch(WidgetStoreTypes.actions.UpdateVisibleWidgets, {
          visibleWidgets: this.localEnabledWidgets,
        })
        .then(() => this.copyData(true))
    },
  },

  mounted(): void {
    this.copyData()
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.toggle-content {
  display: flex;
  width: 70%;
  flex-direction: column;

  .toggle-headers {
    font-size: 18px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-around;
  }
}

.widgets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.widget {
  border: 1px solid $border-primary;
  padding: 5px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  background-color: $tertiary;
  border-radius: 5px;
  align-items: center;
  text-align: center;

  &.enabled {
    grid-column: 2;
    flex-direction: row-reverse;

    .move-button {
      transform: scaleX(-1);
    }
  }

  &.disabled {
    grid-column: 1;
  }
}

.empty {
  grid-row-start: 1;

  &.enabled {
    grid-column: 2;
  }
}

.flip-list-move {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.widget-toggle-list {
  display: flex;
  width: 100%;
  justify-content: space-around;

  .toggle-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.toggle-list-actions-wrapper {
  width: 20%;

  .toggle-list-actions-content {
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
</style>
