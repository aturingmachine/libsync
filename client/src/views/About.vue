<template>
  <div class="page about">
    <div class="about-wrapper">
      <h1>About LibSync</h1>
      <div v-if="!!about.cwd" class="about-info">
        <div class="about-data">
          <h3>CWD</h3>
          <span class="data">{{ about.cwd }} </span>
        </div>

        <div class="about-data">
          <h3>Node Location</h3>
          <span class="data">{{ about.nodeLocation }}</span>
        </div>

        <div class="about-data">
          <h3>Service Version</h3>
          <span class="data">{{ about.serviceVersion }}</span>
        </div>

        <div class="about-data">
          <h3>PID</h3>
          <span class="data">{{ about.pid }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { LibSyncAboutInfo } from '@/models/about-info'
import { AboutService } from '@/services/about-service'

import Vue from 'vue'
export default Vue.extend({
  name: 'About',

  data: () => {
    return {
      about: {} as LibSyncAboutInfo,
    }
  },

  mounted(): void {
    AboutService.getAboutInfo().then(about => (this.about = about))
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.about {
  display: flex;
  width: 100%;
  justify-content: center;
}

.about-wrapper {
  max-width: 600px;
}

.data {
  font-family: 'Roboto Mono';
}

.about-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // flex-direction: column;

  .about-data {
    width: 45%;
    text-align: left;
    margin-bottom: 16px;

    h3 {
      text-align: left;
      border-bottom: 1px solid $border-primary;
    }
  }
}
</style>
