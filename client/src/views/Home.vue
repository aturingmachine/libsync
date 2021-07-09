<template>
  <div class="page home">
    <div class="home-content intro-item" :class="wrapperClass">
      <h1 class="home-header stage-0-only final intro-item">LibSync</h1>
      <article>
        <caption class="stage-0-only intro-item">
          <em>An Overly Complex Solution To A Simple Problem</em>
        </caption>

        <caption class="stage-1-only intro-item">
          <b>"This seems like overkill"</b>
          -
          <em>My Friends When I Explain This Project</em>
        </caption>

        <div class="final intro-item tab-holder">
          <button
            @click="textIndex = 0"
            class="about-tab"
            :class="textIndex !== 0 || 'active'"
          >
            About LibSync
          </button>
          <button
            @click="textIndex = 1"
            class="about-tab"
            :class="textIndex !== 1 || 'active'"
          >
            About This Client
          </button>
        </div>
        <section class="final intro-item">
          <transition name="help-text-tabs">
            <span :key="textIndex" v-html="texts[textIndex]" />
          </transition>
        </section>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { RootGetterTypes, RootMutationTypes } from '@/store'
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',

  data: () => {
    return {
      wrapperClass: '',
      textIndex: 0,
      texts: [
        `Welcome to LibSync. A solution to the problem of automatically
          syncing, or even just copying, files from one directory to another.
          You can read more about this project
          <a href="https://github.com/aturingmachine/libsync#readme">here</a>.
          <br /><br />If you experience an issue or would like to submit an idea
          for a feature feel free to visit the
          <a href="https://github.com/aturingmachine/libsync/issues"
            >Issue Tracker</a
          >. <br /><br />If you would like to work on LibSync, check out the
          <a href="https://github.com/aturingmachine/libsync/issues"
            >Issue Tracker</a
          >
          and find an issue you think you can take on!.
          <br /><br />To see what new feature/bug fixes/releases are in the
          works, check out the
          <a href="https://github.com/aturingmachine/libsync/projects/1"
            >Roadmap</a
          >`,
        `This is the LibSync Client. You can use it to manage your
          configuration settings, view and filter logs, and more to come. Heres
          some quick tips: <br />
          <ul>
            <li>
              The <span class="material-icons inline-icon">lock</span> in the top right is an indicator of
              LibSync's current state. During configuration updates and syncs
              LibSync will "lock", preventing further changes to the
              configuration or syncs until the previous process has completed.
              This locking system currently <em>does not</em> support queueing
              of actions.
            </li>
            <li>
              The <span class="material-icons inline-icon">menu</span> button in the top left will open the
              navigation menu. From there you will find links to the
              Configuration, Info, and Logging pages.
            </li>
          </ul>`,
      ],
    }
  },

  mounted(): void {
    if (!this.$store.getters[RootGetterTypes.HasShownIntro]) {
      setTimeout(() => (this.wrapperClass = 'set'))
      setTimeout(() => (this.wrapperClass = 'stage-1'), 3000)
      setTimeout(() => {
        this.wrapperClass = 'final-stage'
        this.$store.commit({ type: RootMutationTypes.SetHasShownIntro })
      }, 6000)
    } else {
      this.wrapperClass = 'final-stage'
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/colors.scss';

.home {
  width: 100%;
  display: flex;
  justify-content: center;
}

.stage-0-only {
  transform: translateY(-150px);
}

.stage-1-only {
  opacity: 0;
  transform: translateX(-500px);
}

.final {
  opacity: 0;
}

.intro-item {
  transition: all 1s ease-in;
  z-index: 0;
}

.home-content {
  opacity: 0;
  width: 600px;
  display: flex;
  flex-direction: column;
  transition: all 1s ease-in;

  &.set {
    opacity: 1;

    .stage-0-only {
      transform: none;
      opacity: 1;
    }
  }

  &.stage-1 {
    opacity: 1;

    .stage-0-only {
      opacity: 0;
    }

    .stage-1-only {
      display: block;
      opacity: 1;
      transform: none;
    }
  }

  &.final-stage {
    opacity: 1;

    .stage-0-only {
      opacity: 0;
    }

    .stage-1-only {
      display: block;
      opacity: 0;
      transform: translateX(500px);
    }

    .final {
      transform: translateY(-100px);
      opacity: 1;

      &.stage-0-only {
        transform: none;
        opacity: 1;
      }
    }
  }
}

caption {
  width: 100%;
}

section {
  border-top: 1px solid $border-primary;
  margin-top: 0;
  padding-top: 16px;
  text-align: left;
  font-size: 18px;
}

li {
  margin-bottom: 6px;

  span.material-icons {
    font-size: 18px !important;
  }
}

.home-header {
  font-size: 48px;
  border-bottom: 1px solid $border-primary;
}

.tab-holder {
  display: flex;
  width: 50%;
  justify-content: space-between;

  .about-tab {
    border: 1px solid $border-primary;
    border-bottom: none;
    background-color: $primary;
    color: $text-primary;
    padding: 4px 8px;
    font-size: 18px;
    border-radius: 8px 8px 0 0;

    &:hover {
      background-color: $tertiary;
      box-shadow: none;
    }

    &.active {
      color: $text-accent;
      background-color: $secondary;
    }
  }
}

.help-text-tabs-enter-active,
.help-text-tabs-leave-active {
  transition: all 0.3s ease-in-out;
}

.help-text-tabs-enter,
.help-text-tabs-leave-to {
  position: absolute;
  opacity: 0;
}
</style>
