<template>
  <div class="box featured" :class="{ 'is-selected': selected }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Featured',
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.featured {
  border: solid #D1DBEC 1px;
  box-shadow: none;
  .box {
    box-shadow: none;
  }

  &.is-selected {
    box-shadow: 0 3px 30px 0px rgba(0,0,0,0.15) !important;
    border: none !important;
  }
}

</style>
