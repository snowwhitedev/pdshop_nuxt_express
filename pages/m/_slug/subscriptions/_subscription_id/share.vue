<template>
  <section>
    <SubscriptionSteps :path="path" :slug="slug">
      <template v-slot:shares>
        <h1 class="has-text-weight-bold is-size-5 is-capitalized">
          {{ getStepTitle('products') }}
        </h1>
        <h3
          class="subtitle has-text-weight-light has-text-grey is-6 is-capitalized"
        >
          {{ getStepSubtitle('products') }}
        </h3>

        <FeaturedList
          v-if="subscriptionLoaded"
          selected-mode="shares"
          :data="products"
          :selected-product="selectedProduct"
          :selected-price="selectedPrice"
          @selected="updateSelection($event)"
        />

        <br>
        <b-button
          class="is-capitalized"
          type="is-black"
          size="is-large"
          expanded
          :disabled="!selectedPrice"
          @click="savesubscriptionAsync"
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
      selectedPrice: null,
      selectedProduct: null,
      subscription: null,
      products: [],
      subscriptionLoaded: false,
      isLoading: false,
      slug: this.$route.params.slug,
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
    this.getSubscriptionByStore();
  },
  methods: {
    updateSelection (payload) {
      this.selectedPrice = payload.price;
      this.selectedProduct = payload.product;
      this.$store.commit('shopping/setSubscription', { product: this.selectedProduct, price: this.selectedPrice });
    },
    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        const { subscriptions } = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`
        );

        this.subscription = subscriptions.find(
          subscription =>
            subscription.subscription_id == this.$route.params.subscription_id
        );

        this.getSharesAsync();
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },
    setSavedProduct (product_id, price_id) {
      if (this.subscription.product_id != null) {
        this.selectedProduct = this.products.find(
          product => product.product_id == product_id
        );
        this.selectedPrice = this.selectedProduct
          ? this.selectedProduct.prices.find(
            price => price.price_id == price_id
          )
          : null;
      }

      this.subscriptionLoaded = true;
    },
    async savesubscriptionAsync () {
      try {
        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscription.subscription_id}`,
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
        this.setSavedProduct(
          this.subscription.product_id,
          this.subscription.stripe_price_id
        );
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
