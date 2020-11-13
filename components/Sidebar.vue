<template>
  <section>
    <b-sidebar
      v-model="sidebarActive"
      :open.sync="sidebarActive"
      fullheight
      overlay
      type="is-black"
      class="sidebar"
    >
      <div id="sidebar" class="section has-text-white">
        <div class="buttons">
          <b-button
            v-if="$route.params.slug && loggedIn && $route.fullPath != `/m/${$route.params.slug}/share`"
            tag="router-link"
            :to="{ path: `/m/${$route.params.slug}/subscriptions` }"
            type="is-dark"
            size="is-large"
            expanded
          >
            My Subscriptions
          </b-button>
          <b-button
            v-if="$route.params.slug && loggedIn"
            type="is-dark"
            size="is-large"
            expanded
            @click="logout()"
          >
            Log out
          </b-button>
        </div>
      </div>
    </b-sidebar>

    <div v-if="loggedIn">
      <b-button
        v-if="!sidebarActive"
        :type="'is-black'"
        class="is-hidden-desktop burger"
        icon-pack="fas"
        icon-left="bars"
        @click="sidebarActive = !sidebarActive"
      />
      <b-button
        v-else
        :type="'is-default'"
        class="is-hidden-desktop burger"
        icon-pack="fas"
        icon-left="times"
        @click="sidebarActive = !sidebarActive"
      />
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Sidebar',
  data () {
    return {
      sidebarActive: false
    };
  },
  computed: {
    ...mapState('shopping', ['loggedIn'])
  },
  created () {
    if (!this.loggedIn) {
      this.$router.push(`/m/${this.$route.params.slug}`);
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

<style lang="scss">
  .burger {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }
  .sidebar{
    height: 100%;
    .buttons {
      position: absolute;
      width: 100%;
      padding: 1rem;
      left: 0;
      bottom: 0.75rem;
    }
  }
</style>
