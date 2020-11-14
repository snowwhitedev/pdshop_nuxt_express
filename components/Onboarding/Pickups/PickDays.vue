<template>
  <div class="modal-card">
    <div class="w-full block p-3 shadow-md modal-card-body bg-gray-200">
      <div class="flex flex-row w-full mb-2">
        <div class="w-full flex flex-col items-center">
          <span class="text-xl text-gray-600 font-semibold">
            Select day of weeks
          </span>
        </div>
        <span
          class="rounded px-2 py-1 bg-red-700 text-white float-right cursor-pointer"
          @click="$emit('close')"
        >
          Done
        </span>
      </div>
      <div class="flex flex-row justify-between">
        <label class="flex flex-row justify-start items-start">
          <div class="select-none cursor-pointer mr-1 uppercase text-sm font-semibold">
            {{ selectAllText }}
          </div>
          <div
            class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
          >
            <input
              id="selectAll"
              v-model="allSelected"
              type="checkbox"
              class="opacity-0 absolute cursor-pointer"
              @click="selectAll"
            />
            <svg
              class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
              viewBox="0 0 20 20"
            >
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          </div>
        </label>
      </div>
      <ul id="customScroll" data-simplebar-auto-hide="false">
        <li
          v-for="(wd, index) in weekDays"
          :key="index"
          class="border border-t-0 border-r-0 border-l-0 border-b"
        >
          <label class="flex justify-start items-start">
            <div
              class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
            >
              <input
                :id="index"
                v-model="selectedDays"
                type="checkbox"
                :value="wd"
                class="opacity-0 absolute cursor-pointer"
              />
              <svg
                class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            </div>
            <div class="select-none cursor-pointer weekdays">
              {{ wd }}
            </div>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { WEEK_DAYS } from "@/store/contants";
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    weekDays: WEEK_DAYS,
    selectedDays: [],
    selectAllText: 'Select All',
    allSelected: false
  }),
  methods: {
    selectAll () {
      this.allSelected = !this.allSelected;
      this.selectAllText = this.allSelected  ? 'Clear All' : 'Select All';
      if (this.allSelected) {
        this.selectedDays = [...this.weekDays];
      } else {
        this.selectedDays = [];
      }
    },
  },
  watch: {
    selectedDays: {
      handler() {
        this.$emit('input', this.selectedDays);
        const set1 = new Set(this.selectedDays);
        if (set1.size === this.weekDays.length) {
          this.allSelected = true;
          this.selectAllText = 'Clear All'
        }
        if (set1.size === 0) {
          this.allSelected = false;
          this.selectAllText = 'Select All'
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.weekdays {
  text-transform: capitalize;
}
</style>