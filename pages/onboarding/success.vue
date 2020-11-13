<template>
  <div class="relative bg-gray-100 h-screen overflow-hidden flex flex-col justify-between">
    <div class="relative pt-6 pb-12 sm:pb-32">
      <Header />
      <main class="mt-8 sm:mt-16 md:mt-20 lg:mt-24 h-full p-5">
        <div class="w-full flex flex-row">
          <div class="md:w-1/2 md:px-8 md:h-64 md:block hidden">
            <img src="/done.svg" alt>
          </div>
          <div class="w-full md:w-1/2 text-gray-900">
            <div class="flex flex-row w-full  bg-white p-2">
              <img src="/tick.svg" alt class="mr-3 h-8 w-8">
              <span class="text-green-400 text-base font-semibold">Click the button below to complete your onboarding process.</span>
            </div>
            <button
              :disabled="loading"
              class="float-right rounded px-3 py-2 mt-2 text-base font-semibold text-white bg-gray-800 hover:bg-gray-700"
              @click="completeStripe"
            >
              <span v-if="loading">Please wait...</span>
              <span v-else>Next</span>
            </button>
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Header from '../../components/header';
import Footer from '../../components/footer';
export default {
  layout: 'none',
  components: {
    Header,
    Footer
  },

  data () {
    return {
      loading: false
    };
  },

  computed: {
    ...mapState(['user', 'loggedIn', 'store', 'token'])
  },

  methods: {
    go () {
      this.$router.replace('/onboarding/create-product');
    },

    async completeStripe () {
      this.loading = true;
      const code = this.$route.query.code;
      const store_id = this.store.store_id;
      const token = this.token;
      try {
        const res = await this.$axios.post(`/stripe/connect/${store_id}`,
          { code },
          {
            headers: {
              'x-access-token': token
            }
          }
        );

        this.$store.commit('setUser', res.data.user);

        this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'Stripe account integration completed successfully',
          position: 'is-bottom-right',
          type: 'is-success'
        });

        this.loading = false;
        this.$router.push('/onboarding/create-product');
      } catch (err) {
        this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'It appears an error occurred!',
          position: 'is-bottom-right',
          type: 'is-success'
        });

        this.loading = false;
        this.$toast.error('An unexpected error occurred');
      };
    }
  }
};
</script>
