<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop.prevent>
          <div class="modal-header">
            <slot name="header"> </slot>
          </div>

          <div class="modal-body">
            <slot name="body"> </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button
                class="destructive wide"
                @click="$emit('modalFooterDeny')"
              >
                Cancel
              </button>
              <button class="submit wide" @click="$emit('modalFooterConfirm')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',

  data: () => {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
