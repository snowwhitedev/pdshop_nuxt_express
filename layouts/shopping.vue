<template>
  <div>
    <client-only>
      <Sidebar />
    </client-only>
    <b-navbar class="is-hidden-touch">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="~assets/logo1.png" alt="Per Diem" height="28">
        </b-navbar-item>
      </template>

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

    <section class="section main-content">
      <div class="columns">
        <div class="column is-hidden-touch">
          <client-only>
            <figure class="image">
              <img :src="coverImage" alt="">
            </figure>
          </client-only>
        </div>
        <div class="column">
          <nuxt />
        </div>
      </div>
    </section>

    <footer class="footer has-background-white">
      <div class="content has-text-centered has-text-white">
        <figure class="image">
          <img src="~/assets/logo.jpg" alt="">
        </figure>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Sidebar from '~/components/Sidebar.vue';
export default {
  name: 'Shopping',
  components: {
    Sidebar
  },
  computed: {
    ...mapState('shopping', ['loggedIn', 'merchant']),
    coverImage: (vm) => {
      return !vm.merchant.background_image ? `${vm.$config.CDN_URL}/backgrounds/welcome.jpg` : vm.merchant.background_image;
    }
  },
  methods: {
    ...mapActions('shopping', ['setLogout']),
    logout () {
      this.$store.commit('setLogout');
      this.setLogout();
      this.$router.push({ path: `/m/${this.$route.params.slug}/` });
    }
  }
};
</script>

<style lang="scss" scoped>
  .main-content {
    min-height: calc(100vh - 6rem);
    @media only screen and (max-width: 768px) {
      padding: 2rem 0.75rem;
    }
  }
  .footer {
    padding-top: 2rem;
    padding-bottom: 2rem;
    figure {
      img {
        width: 10rem;
      }
    }
  }
</style>
