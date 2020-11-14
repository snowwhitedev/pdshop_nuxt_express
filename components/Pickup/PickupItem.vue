<template>
  <div>
    <Featured :selected="selected" class="pickup">
      <div class="columns is-mobile" @click="onClick">
        <div class="has-background-light column box is-3">
          <div class="has-text-centered">
            <p class="has-text-weight-bold is-capitalized is-size-5">
              {{ item.name }}
            </p>
          </div>
        </div>
        <div class="column">
          <div>
            <p class="is-size-6 has-text-weight-bold is-capitalized">
              {{ item.title }}
            </p>
            <div class="is-size-7 has-text-grey">
              <b-icon pack="fas" icon="map-marker-alt" size="is-small" />
              {{
                `${item.location.address}, ${item.location.city}, ${item.location.state}, ${item.location.country}`
              }}
            </div>
          </div>
        </div>
      </div>
    </Featured>
    <transition name="slide">
      <ul v-if="selected" class="weekdays">
        <li
          v-for="wd in item.days_of_week"
          :key="wd.day_of_week"
          :class="{selected: isSelected(wd) }"
          @click="onDaySelect(wd)"
        >
          <span class="day">{{ wd.day_of_week }}</span>
          <span>
            {{ wd.start_time }} - {{ wd.end_time }}
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import Featured from "@/components/Featured.vue";
export default {
  components: {
    Featured,
  },
  props: {
    item: Object,
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    daySelectedIdx: 0
  }),
  
  methods: {
    onClick() {
      this.onEmit();
    },
    onDaySelect(wd) {
      this.daySelectedIdx = this.item.days_of_week.indexOf(wd);
      this.onEmit();
    },
    isSelected(wd) {
      return this.daySelectedIdx === this.item.days_of_week.indexOf(wd);
    },
    onEmit() {
      this.item.day_of_week = this.item.days_of_week[this.daySelectedIdx].day_of_week;
      this.item.start_time = this.item.days_of_week[this.daySelectedIdx].start_time;
      this.item.end_time = this.item.days_of_week[this.daySelectedIdx].end_time;
      this.$emit("select", this.item);
    }
  },
};
</script>

<style lang="scss" scoped>
.box.is-selected {
  .column.box {
    background-color: black !important;
    color: white !important;
  }
}
.pickup {
  cursor: pointer;
  margin-bottom: 10px !important;
}
.has-background-light {
  margin-bottom: 0 !important;
}
ul.weekdays {
  li {
    border: solid #D1DBEC 1px;
    border-radius: 6px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    cursor: pointer;
    &:last-child {
      margin-bottom: 0;
    }
    .day {
      text-transform: capitalize;
      font-weight: bold;
    }
    &.selected {
      box-shadow: 0 3px 30px 0px rgba(0,0,0,0.15) !important;
      border: none !important;
      background:  rgb(0, 0, 0);
      color: white;
    }
  }

  .slide-enter {
    opacity: 0;
    animation: slide-in 3s ease-out forwards;
  }
  .slide-enter-active {
    transition: opacity 3s;
  }
  .slide-leave {
    /* transition: ; */
  }
  .slide-leave-active {
    animation: slide-out 3s ease-out forwards ;
    transition: opacity 3s;
    opacity: 0;
  }

  @keyframes slide-in {
    from {
      transform: translateY(20px);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes slide-out {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(20px);
    }
  }
}
</style>