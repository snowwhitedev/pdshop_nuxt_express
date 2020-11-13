<template>
  <section>
    <div class="columns is-centered ">
      <div class="column is-full">
        <SubscriptionSteps :path="'/share'" :slug="slug">
          <template v-slot:shares>
            <h1 class="title is-4 is-capitalized">
              {{ getStepTitle('products') }}
            </h1>
            <h3 class="subtitle has-text-weight-light is-6 is-capitalized">
              {{ getStepSubtitle('products') }}
            </h3>

            <FeaturedList
              selected-mode="shares"
              :data="products"
              :selected-product="selectedProduct"
              :selected-price="selectedPrice"
              @selected="updateSelection($event)"
            />

            <br>
            <b-button
              class="is-uppercase"
              type="is-dark"
              expanded
              :disabled="!selectedPrice"
              @click="createSuscription"
              @selected="updateSelection($event)"
            >
              Next
            </b-button>
            <b-loading
              :is-full-page="false"
              :active.sync="isLoading"
              :can-cancel="false"
            />
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
      selectedPrice: {},
      selectedProduct: {},
      products: [],
      isLoading: false,
      slug: this.$route.params.slug,
      subscription: {},
      path: '/share'
    };
  },
  computed: {
    ...mapState('shopping', ['merchant']),
    ...mapGetters('shopping', [
      'getStepTitle',
      'getStepSubtitle',
      'getStepStatus',
      'getRoutesDictionary'
    ]),
    ROUTES_DICTIONARY: (vm) => {
      return vm.getRoutesDictionary();
    }
  },
  mounted () {
    this.getSharesAsync();
  },
  methods: {
    updateSelection (payload) {
      this.selectedPrice = payload.price;
      this.selectedProduct = payload.product;
      this.$store.commit('shopping/setSubscription', { product: this.selectedProduct, price: this.selectedPrice });
    },
    async savesubscriptionAsync (id) {
      try {
        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${id}`,
          {
            product_id: this.selectedProduct.product_id,
            frequency: this.selectedProduct.frequency,
            stripe_price_id: this.selectedPrice.price_id,
            stipe: this.subscription.stripe,
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
    async getSharesAsync () {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/products/${this.merchant.store_id}`
        );

        this.products = response.products;
        this.products.sort((a, b) => (a.ui_order > b.ui_order) ? 1 : -1);
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    async createSuscription () {
      this.isLoading = true;
      let createdSubscription_id = null;
      try {
        const { subscription } = await this.$axios.$post(
          `${this.$config.API_URL}/shop/subscriptions/${this.merchant.store_id}`,
          {
            responseType: 'json'
          }
        );
        createdSubscription_id = subscription.subscription_id;
        this.subscription = subscription;
        this.savesubscriptionAsync(createdSubscription_id);
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
