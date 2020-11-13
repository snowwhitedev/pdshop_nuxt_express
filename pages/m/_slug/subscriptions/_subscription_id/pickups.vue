<template>
  <section>
    <div class="columns is-centered ">
      <div class="column is-10">
        <SubscriptionSteps :path="path" :slug="merchant.slug">
          <template v-slot:pickups>
            <h1 class="has-text-weight-bold is-size-5 is-capitalized">
              {{ getStepTitle('pickup') }}
            </h1>
            <h3
              class="subtitle has-text-weight-light has-text-grey is-6 is-capitalized"
            >
              {{ getStepSubtitle('pickup') }}
            </h3>
            <FeaturedList
              v-if="subscriptionLoaded"
              selected-mode="pickups"
              :selected-pickup="selectedPickup"
              :data="pickups"
              @selected="updateSelection($event)"
            />
            <br>
            <b-button
              class="is-capitalized"
              type="is-black"
              size="is-large"
              expanded
              :disabled="!selectedPickup"
              @click="savesubscriptionAsync()"
            >
              Next
            </b-button>
            <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false" />
          </template>
        </SubscriptionSteps>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import FeaturedList from '~/components/FeaturedList';
import SubscriptionSteps from '~/components/SubscriptionSteps';

export default {
  layout: 'shopping',
  components: {
    FeaturedList,
    SubscriptionSteps
  },
  data () {
    return {
      activeStep: 2,
      selectedPickup: null,
      pickups: null,
      subscription: null,
      subscriptionLoaded: false,
      isLoading: false,
      path: '/pickups'
    };
  },
  computed: {
    ...mapState('shopping', ['merchant']),
    ...mapGetters('shopping', [
      'getStepTitle',
      'getStepSubtitle',
      'getRoutesDictionary'
    ]),
    ROUTES_DICTIONARY: (vm) => {
      return vm.getRoutesDictionary();
    }
  },
  mounted () {
    this.getSubscriptionByStore();
  },
  methods: {
    updateSelection (payload) {
      this.selectedPickup = payload.pickup;
    },
    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`);

        this.subscription = response.subscriptions.find(
          subscription => subscription.subscription_id == this.$route.params.subscription_id
        );
        this.getPickupsAsync();
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    setSavedPickup (pickup_id) {
      this.selectedPickup = this.pickups.find(
        pickup => pickup.pickup_id == pickup_id
      );
      this.subscriptionLoaded = true;
    },
    async savesubscriptionAsync () {
      try {
        this.$axios.setHeader('Authorization', this.$store.state.userToken);
        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscription.subscription_id}`,
          {
            product_id: this.subscription.product_id,
            frequency: this.subscription.frequency,
            stripe_price_id: this.subscription.stripe_price_id,
            stipe: this.subscription.stripe,
            pickup_id: this.selectedPickup.pickup_id,
            is_active: this.subscription.is_active
          }
        );
        const route = this.ROUTES_DICTIONARY.find(
          route => route.path === this.path
        );
        const nextPath = this.ROUTES_DICTIONARY[route.stepIndex + 1];
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${this.subscription.subscription_id}${nextPath.path}`
        });
      } catch (e) {
        console.error(e.message);
      } finally {
        // Do Somethin
      }
    },
    sortItems (a, b) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      const a_index = days.indexOf(a.day_of_week);
      const b_index = days.indexOf(b.day_of_week);

      return a_index < b_index ? 0 : 1;
    },
    async getPickupsAsync () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/pickups/singleProduct/${this.merchant.store_id}?product_id=${this.subscription.product_id}`);

        this.pickups = response.pickups;
        this.setSavedPickup(this.subscription.pickup_id);
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    }
  },
  head () {
    return {
      title: `Per Diem | ${this.merchant ? this.merchant.name : ''} ${
        this.merchant && this.merchant.description ? `- ${this.merchant.description}` : ''
      }`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.merchant ? this.merchant.description : ''
        }
      ]
    };
  }
};
</script>
