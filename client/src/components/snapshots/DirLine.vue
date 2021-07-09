<template>
  <div class="dir-line-wrapper">
    <button
      @click="isOpen = !isOpen"
      :class="[levelClass, isDir ? 'dir' : 'file']"
      class="dir-line bare"
    >
      <span class="bracket" v-if="!isRoot"> &#8990;</span>
      <icon>{{ iconName }}</icon>
      <span class="dir-name-label">{{ path }}</span>
    </button>
    <template v-if="hasChildren">
      <transition name="expand">
        <div class="expandable" v-show="isOpen">
          <dir-line
            v-for="[key, child] in children"
            :struct="child.contents"
            :key="child.fullRelativePath"
            :level="level + 1"
            :path="key"
            :isDir="child.isDir"
          />
        </div>
      </transition>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DirStructInside } from '../../models/lib-snapshots'

export default Vue.extend({
  name: 'DirLine',

  props: {
    path: {
      type: String,
      required: true,
    },

    struct: {
      type: Object as PropType<DirStructInside>,
      required: true,
    },

    level: {
      type: Number,
      required: true,
    },

    isDir: {
      type: Boolean,
      required: true,
    },
  },

  data: () => {
    return {
      isOpen: false,
    }
  },

  computed: {
    children(): [string, DirStructInside][] {
      return Object.entries(this.struct)
    },

    hasChildren(): boolean {
      return this.children.length > 0
    },

    isRoot(): boolean {
      return this.level === 1
    },

    levelClass(): string {
      const evaluatedLevel = Math.min(7, this.level)

      return `dir-level-${evaluatedLevel}`
    },

    iconName(): string {
      if (!this.isDir) {
        return 'description'
      }

      return this.isOpen ? 'folder_open' : 'folder'
    },
  },

  methods: {},
})
</script>
