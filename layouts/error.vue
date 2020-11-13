<template>
  <div class="container">
    <section class="section columns is-mobile is-centered">
      <div class="column is-half-desktop is-full-touch">
        <figure v-if="error.statusCode === 404" class="image">
          <img src="~/assets/404.svg" alt="Page not found">
        </figure>
        <h1 v-else class="has-text-weight-bold title has-text-grey-dark">
          An error occurred
        </h1>
        <a class="is-size-5 has-text-weight-semibold" @click="$router.back()">
          <b-icon pack="fas" icon="chevron-left" />
          <span>
            Go Back
          </span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>
