<template>
  <ul class="inline-flex list-none border border-transparent bg-white text-gray-700 rounded text-sm w-auto p-2">
    <li class="inline-block">
      <button :disabled="isInFirstPage" class="block mr-1 border-r bg-gray-300 px-3 py-2 rounded-l disabled:opacity-50" @click="onClickFirstPage">
        First
      </button>
    </li>
    <li class="inline-block">
      <button :disabled="isInFirstPage" class="block mr-1 border-r bg-gray-300 px-3 py-2 rounded-l disabled:opacity-50" @click="onClickPrevious">
        Prev
      </button>
    </li>
    <li v-for="page in pages" :key="page.name" class="inline-block">
      <button :disabled="page.isDisabled" class="block mr-1 border px-3 py-2" :class="{ 'bg-gray-700 text-white': isPageActive(page.name) }" @click="onClickPage(page.name)">
        {{ page.name }}
      </button>
    </li>
    <li class="inline-block">
      <button :disabled="isInLastpage" class="block mr-1 border-r bg-gray-300 px-3 py-2 rounded-l disabled:opacity-50" @click="onClickNext">
        Next
      </button>
    </li>
    <li class="inline-block">
      <button :disabled="isInLastpage" class="block border-r bg-gray-300 px-3 py-2 rounded-l disabled:opacity-50" @click="onClickLastPage">
        Last
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    maxVisibleButtons: {
      type: Number,
      required: true,
      default: 3
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },

  computed: {
    startPage () {
      // when on first page
      if (this.currentPage === 1) {
        return 1;
      }

      // when on last page
      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons;
      }

      // when in between
      return this.currentPage - 1;
    },

    pages () {
      const range = [];
      for (let i = 1; i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages); i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }

      return range;
    },

    isInFirstPage () {
      return this.currentPage === 1;
    },

    isInLastpage () {
      return this.currentPage === this.totalPages;
    }
  },

  methods: {
    onClickFirstPage () {
      this.$emit('pageChanged', 1);
    },

    onClickNext () {
      this.$emit('pageChanged', this.currentPage + 1);
    },

    onClickPrevious () {
      this.$emit('pageChanged', this.currentPage - 1);
    },

    onClickPage (page) {
      this.$emit('pageChanged', page);
    },

    onClickLastPage () {
      this.$emit('pagechanged', this.totalPages);
    },

    isPageActive (page) {
      return this.currentPage === page;
    }
  }
};
</script>
