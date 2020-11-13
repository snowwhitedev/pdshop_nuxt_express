<template>
  <div>
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="~assets/logo1.png" alt="Per Diem" height="28">
        </b-navbar-item>
      </template>
      <template slot="start" />

      <template slot="end">
        <b-navbar-item
          v-if="$route.params.slug && loggedIn && $route.fullPath != `/m/${$route.params.slug}/share`"
          tag="router-link"
          :to="{ path: `/m/${$route.params.slug}/subscriptions` }"
          class=""
        >
          My Subscriptions
        </b-navbar-item>
        <b-navbar-item
          v-if="$route.params.slug && loggedIn"
          tag="a"
          class=""
          @click="logout()"
        >
          Log out
        </b-navbar-item>
      </template>
    </b-navbar>

    <section class="main-content section">
      <nuxt />
    </section>

    <footer class="footer has-background-dark">
      <div class="content has-text-centered has-text-white">
        Proudly created with <a class="has-text-primary" target="_blank" href="https://per-diem.co/">Per Diem</a>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('shopping', ['loggedIn'])
  },
  methods: {
    ...mapActions('shopping', ['setLogout']),
    logout () {
      this.setLogout();
      this.$router.push({ path: `/m/${this.$route.params.slug}/` });
    }
  }
};
</script>

<style lang="scss" scoped>
  .main-content {
    min-height: calc(100vh - 13.75rem);
  }
</style>
