<template>
  <section>
    <div class="columns is-centered">
      <div class="column is-10">
        <SubscriptionSteps :path="'/checkout'" :slug="merchant.slug">
          <template v-slot:checkout>
            <h1 class="title has-text-centered is-4">
              {{ getStepTitle("checkout") }}
            </h1>
            <h3 class="subtitle has-text-weight-light has-text-centered is-6">
              {{ getStepSubtitle("checkout") }}
            </h3>

            <Featured v-if="summary" class="has-background-muted">
              <h1 class="subtitle is-6 is-capitalized has-text-weight-bold">
                Your Plan
              </h1>
              <Featured>
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Your share
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/share`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>

                <hr>

                <div class="columns">
                  <div class="column">
                    <p class="has-text-weight-bold is-size-6">
                      {{ summary.product.title }}
                    </p>
                    <p class="is-size-7">
                      {{ summary.product.description }}
                    </p>
                  </div>
                  <div class="column">
                    <div class="is-size-7 has-text-right">
                      <p class="is-capitalized has-text-grey">
                        {{
                          `$${summary.price.price}/${summary.price.interval}`
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </Featured>

              <Featured v-if="summary.addons && summary.addons.length > 0">
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Add-ons
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/addons`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>

                <hr>

                <div v-for="(addon, index) in summary.addons" :key="index" class="columns">
                  <div class="column">
                    <p class="has-text-weight-bold is-size-6">
                      {{ addon.title }}
                    </p>
                    <p class="is-size-7">
                      {{ addon.description }}
                    </p>
                  </div>
                  <div class="column">
                    <div class="is-size-7 has-text-right">
                      <p class="is-capitalized has-text-grey">
                        {{
                          `$${addon.price}`
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </Featured>

              <Featured>
                <div class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item">
                      <p class="is-size-7">
                        Pick it up at
                      </p>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <b-button
                        tag="router-link"
                        type="is-primary"
                        size="is-small"
                        :to="`/m/${merchant.slug}/subscriptions/${subscription_id}/pickups`"
                      >
                        Edit
                      </b-button>
                    </div>
                  </div>
                </div>

                <hr>
                <div class="columns is-mobile">
                  <div
                    class="has-background-black has-text-white column box is-narrow"
                  >
                    <div class="has-text-centered">
                      <p class="has-text-weight-bold is-capitalized is-size-5">
                        {{ getDayOfTheWeekAbr(summary.pickup.day_of_week) }}
                      </p>
                      <p class="is-size-7">
                        {{
                          `${summary.pickup.start_time} - ${summary.pickup.end_time}`
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="column">
                    <div>
                      <p class="is-size-6 has-text-weight-bold is-capitalized">
                        {{ summary.pickup.title }}
                      </p>
                      <div class="is-size-7 has-text-grey">
                        <b-icon
                          pack="fas"
                          icon="map-marker-alt"
                          size="is-small"
                        />
                        {{
                          `${summary.pickup.location.address}, ${summary.pickup.location.city}, ${summary.pickup.location.state}, ${summary.pickup.location.country}`
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </Featured>
            </Featured>

            <Featured v-if="summary">
              <div v-if="merchant.coupons_enabled">
                <div class="flex flex-col w-full">
                  <label
                    for="coupon"
                    class="mb-1 text-base font-medium text-gray-800"
                  >Do you have a coupon code?</label>
                  <div class="grid grid-flow-row grid-cols-12">
                    <input
                      v-model="coupon_code"
                      type="text"
                      name="coupon"
                      placeholder="Enter coupon code..."
                      :disabled="loading"
                      class="px-4 py-2 col-span-8 border border-gray-500 rounded rounded-r-none disabled:opacity-50"
                    >
                    <button
                      class="relative col-span-4 flex justify-center px-4 py-2 rounded-l-none text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                      @click="claimCoupon"
                    >
                      <span v-if="loading">please wait...</span>
                      <span v-else>Claim Coupon</span>
                    </button>
                  </div>
                </div>
              </div>
              <h2 class="has-text-weight-bold is-capitalized">
                Order Summary
              </h2>
              <br>
              <div class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    {{ summary.product.title }}
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      {{ `$${summary.price.price} ` }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="discounted" class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Discount
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      $-{{ coupon_amount }}
                    </p>
                  </div>
                </div>
              </div>
              <hr>
              <div class="columns is-mobile">
                <div class="column">
                  <p class="is-size-7 has-text-grey">
                    Subtotal
                  </p>
                </div>
                <div class="column">
                  <div class="is-size-7 has-text-right">
                    <p class="is-capitalized">
                      {{
                        `$${
                          Object.entries(coupon).length !== 0
                            ? (Number(summary.price.price) + addons_price_total) - coupon_amount
                            : (Number(summary.price.price) + addons_price_total)
                        } `
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </Featured>

            <b-button
              class="is-uppercase"
              type="is-dark"
              expanded
              @click="createOrder"
            >
              Place Your Order
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
import Featured from '~/components/Featured';
export default {
  layout: 'shopping',
  components: {
    Featured
  },
  data () {
    return {
      subscription_id: this.$route.params.subscription_id,
      subscriptionLoaded: false,
      isLoading: false,
      loading: false,
      summary: null,
      coupon_code: null,
      valid_coupon_code: null,
      coupon_amount: null,
      coupon: {},
      discounted: false,
      addons_price_total: 0
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'subscription']),
    ...mapGetters('shopping', ['getStepTitle', 'getStepSubtitle'])
  },
  mounted () {
    this.getSubscriptionByStore();
  },
  methods: {
    async claimCoupon () {
      try {
        this.loading = true;
        const user_id = this.$store.state.user.user_id;
        const coupon = await this.$axios.get(
          `/shop/coupons/${this.coupon_code}`
        );

        const couponDate = new Date(coupon.data.coupon.expires);
        const formatter = new Intl.DateTimeFormat();
        const expiry = formatter.format(couponDate);
        const today = formatter.format(Date.now());

        if (expiry < today) {
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'This coupon has expired!',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }

        const subscription = await this.$axios.get(
          `/shop/subscriptions/${this.subscription.subscription_id}/coupon?user_id=${user_id}&coupon_id=${coupon.data.coupon.coupon_id}`
        );

        if (subscription.data.subscription) {
          this.loading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Coupon has already been used!',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }

        if (coupon.data.coupon.is_active) {
          this.valid_coupon_code = coupon.data.coupon.name;
          this.discounted = true;
          this.coupon = coupon.data.coupon;

          await this.$axios.put(`/shop/subscriptions/${this.subscription.subscription_id}`, { coupon_id: coupon.data.coupon.coupon_id });

          if (coupon.data.coupon.isPercent) {
            this.coupon_amount =
              coupon.data.coupon.amount * 0.01 * this.summary.price.price;
          } else {
            this.coupon_amount = coupon.data.coupon.amount;
          }
        } else {
          this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Coupon code is invalid',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
        this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      } finally {
        this.coupon_code = null;
      }
    },

    async getSubscriptionByStore () {
      this.isLoading = true;
      try {
        this.subscriptionLoaded = true;
        await this.getSubscriptionSummary(this.subscription_id);
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    async getSubscriptionSummary (subscription_id) {
      this.isLoading = true;
      try {
        const response = await this.$axios.$get(
          `${this.$config.API_URL}/shop/subscriptions/${subscription_id}`
        );
        this.summary = response.summary;
        this.summary.subscription_id = subscription_id;
        this.$store.commit('shopping/setSubscription', this.summary);

        // get total price of selected addons
        if (this.summary.addons) {
          this.summary.addons.forEach((item) => {
            this.addons_price_total += Number(item.price);
          });
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    convertToTime (hours) {
      const time = new Date(null);
      return new Date(time.setHours(hours)).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    createOrder () {
      // TODO: Add stripe logic
      this.$router.push(
        `/m/${this.merchant.slug}/subscriptions/${
          this.subscription_id
        }/stripeCheckout${
          this.valid_coupon_code ? '?coupon=' + this.valid_coupon_code : ''
        }`
      );
    },

    getDayOfTheWeekAbr (dayOfTheWeek) {
      return dayOfTheWeek.substring(0, 3);
    }
  },
  head () {
    return {
      title: `Per Diem | ${this.merchant ? this.merchant.name : ''} ${
        this.merchant && this.merchant.description
          ? `- ${this.merchant.description}`
          : ''
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

<style lang="scss" scoped>
.has-background-muted {
  background-color: #f3f6fb;
  border: none;
  .columns {
    margin: 0;
    .box {
      margin-bottom: 0;
    }
  }
}
.level {
  margin-bottom: 0;
}
hr {
  margin: 0.75rem 0;
}
.field {
  &.is-grouped {
    .field {
      margin-bottom: 0;
    }
    input {
      border: solid #d1dbec 1px;
    }
    #expiration,
    #cvc {
      width: 4.5rem !important;
    }
  }
}
</style>
