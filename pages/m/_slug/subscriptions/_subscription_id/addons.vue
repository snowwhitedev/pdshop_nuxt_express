<template>
  <section>
    <div class="columns is-centered ">
      <div class="column is-10">
        <SubscriptionSteps :path="path" :slug="merchant.slug">
          <template v-slot:addons>
            <h1 class="title has-text-left is-4 is-capitalized">
              {{ getStepTitle('addons') }}
            </h1>
            <h3 class="subtitle has-text-weight-light has-text-left is-6 is-capitalized">
              {{ getStepSubtitle('addons') }}
            </h3>
            <FeaturedList
              v-if="subscriptionLoaded"
              selected-mode="addons"
              :selected-addons="selectedAddons ? selectedAddons : []"
              :data="addons"
              @selected="updateSelection($event)"
            />
            <br>
            <div class="columns is-mobile">
              <div class="column">
                <b-button
                  class="is-uppercase"
                  expanded
                  @click="$router.push({ path: `/m/${merchant.slug}/subscriptions/${subscriptionData.subscription_id}/share` })"
                >
                  Previous
                </b-button>
              </div>
              <div class="column">
                <b-button
                  class="is-uppercase"
                  type="is-dark"
                  expanded
                  :disabled="!selectedAddons"
                  @click="savesubscriptionAsync()"
                >
                  <span v-if="payload.length < 1">Skip</span>
                  <span v-else>Next</span>
                </b-button>
              </div>
            </div>
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
      selectedAddons: [],
      addons: null,
      subscriptionData: null,
      subscriptionLoaded: false,
      isLoading: false,
      payload: [],
      path: '/addons'
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'subscription']),
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
    updateSelection (data) {
      const addons_data = {
        product_id: this.subscription.product.stripe_product_id,
        interval: this.subscription.price.interval,
        amount: '',
        addons_id: data.addonsId
      };

      // loop through payload to make sure duplicate objects are not registered
      // and to make sure items removed from selected addons are removed from payload
      this.payload.forEach((item, index) => {
        const addonItem = data.addon.find(x => item.addons_id === x.addons_id);
        if (!addonItem) {
          this.payload.splice(index, 1);
        }
      });

      // loop through event data to get current selected addon
      data.addon.map((x) => {
        if (x.addons_id === addons_data.addons_id) {
          addons_data.amount = Number(x.price);
          this.payload.push(addons_data);
        }
      });

      this.selectedAddons = data.addon;
    },

    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`);

        this.subscriptionData = response.subscriptions.find(
          subscription => subscription.subscription_id == this.$route.params.subscription_id
        );
        this.getAddonsAsync();
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    setSavedAddon (addons_ids) {
      if (addons_ids) {
        this.selectedAddons = this.addons.filter(addon => addons_ids.includes(addon.addons_id));
      }
      this.subscriptionLoaded = true;
    },

    async savesubscriptionAsync () {
      this.isLoading = true;
      const route = this.ROUTES_DICTIONARY.find(
        route => route.path === this.path
      );
      const nextPath = this.ROUTES_DICTIONARY[route.stepIndex + 1];

      try {
        // skip addons step if no addons is selected
        if (this.payload.length < 1) {
          this.$router.push({
            path: `/m/${this.merchant.slug}/subscriptions/${this.subscriptionData.subscription_id}${nextPath.path}`
          });
        }

        this.$axios.setHeader('Authorization', this.$store.state.userToken);

        // create stripe price objects for add-on
        const stripe_price_ids = await this.$axios.$post(`${this.$config.API_URL}/stripe/stores/${this.merchant.store_id}/prices`, { payload: this.payload });

        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscriptionData.subscription_id}`,
          {
            product_id: this.subscriptionData.product_id,
            frequency: this.subscriptionData.frequency,
            stripe_price_id: this.subscriptionData.stripe_price_id,
            stipe: this.subscriptionData.stripe,
            pickup_id: this.subscriptionData.pickup_id,
            addons_ids: this.selectedAddons.map(a => a.addons_id),
            addons_stripe_price_ids: JSON.stringify(stripe_price_ids.prices),
            is_active: this.subscriptionData.is_active
          }
        );
        this.isLoading = false;
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${this.subscriptionData.subscription_id}${nextPath.path}`
        });
      } catch (e) {
        this.isLoading = false;
        this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
        console.error(e.message);
      } finally {
        // Do Somethin
      }
    },

    async getAddonsAsync () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/addons/${this.merchant.store_id}?product_id=${this.subscriptionData.product_id}`);

        this.addons = response.addons;
        this.setSavedAddon(this.subscriptionData.addons_ids);
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
