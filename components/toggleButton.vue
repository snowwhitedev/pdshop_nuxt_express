<template>
  <div>
    <div class="form-switch inline-block align-middle">
      <input
        :id="index"
        v-model="isToggleOn"
        :value="value"
        type="checkbox"
        :name="index"
        class="form-switch-checkbox"
        @click="changeState"
      >
      <label class="form-switch-label" :for="index" />
    </div>
    <label class="text-xs text-grey-dark" :for="index">{{ `${ isToggleOn ? onText : offText }` }}</label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    onText: {
      type: String,
      required: true
    },
    offText: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isToggleOn: false
    };
  },
  mounted () {
    this.isToggleOn = this.value;
  },
  methods: {
    changeState () {
      this.isToggleOn = !this.isToggleOn;
      this.$emit('state-change', this.isToggleOn);
    }
  }
};
</script>

<style lang="postcss">
  /* CHECKBOX TOGGLE SWITCH */
  .form-switch {
      @apply relative select-none w-12 mr-2 leading-normal;
  }
  .form-switch-checkbox {
      @apply hidden;
  }
  .form-switch-label {
      @apply block overflow-hidden cursor-pointer bg-gray-500 border border-none rounded-full h-6  shadow-inner;
      transition: background-color 0.2s ease-in;
  }
  .form-switch-label:before {
      @apply absolute block bg-white inset-y-0 w-6 border rounded-full -ml-1;

      right: 50%;
      content: "";
      transition: all 0.2s ease-in;
  }
  .form-switch-checkbox:checked + .form-switch-label,
  .form-switch-checkbox:checked + .form-switch-label:before {

  }
  .form-switch-checkbox:checked + .form-switch-label {
      @apply bg-green-500 shadow-none;
  }
  .form-switch-checkbox:checked + .form-switch-label:before {
      @apply right-0;
  }
</style>
