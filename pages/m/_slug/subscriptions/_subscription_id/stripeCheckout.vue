<template>
  <div class="flex flex-col items-center w-full p-56">
    <span class="text-xl font-semibold text-gray-800">Redirecting to stripe...</span>
    <img src="/Spinner.svg" alt="" height="40" width="40">
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('shopping', ['merchant', 'subscription', 'store'])
  },
  async created () {
    // fetch subscriptions from database
    const { subscriptions } = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`
    );
    const subscriptionId = this.$route.params.subscription_id;
    const subscription = subscriptions.find(x => x.subscription_id == subscriptionId);
    const STRIPE_PUBLISHABLE_KEY = this.merchant && this.merchant.is_production
      ? this.$config.STRIPE_LIVE_PUBLISHABLE_KEY
      : this.$config.STRIPE_TEST_PUBLISHABLE_KEY;

    // eslint-disable-next-line no-undef
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY, {
      stripeAccount: this.merchant.stripe_user_id
    });

    const url = `/stripe/stores/${this.merchant.store_id}/stripeSession`;
    const payload = {
      lineItems: [
        {
          price: this.subscription.price.price_id,
          quantity: 1
        }
      ],
      slug: this.$route.params.slug,
      application_fee: this.merchant.subscription_fee
    };

    // include addons prices with the stripe subscription payload
    if (subscription.addons_stripe_price_ids &&
        Array.isArray(subscription.addons_stripe_price_ids) &&
        subscription.addons_stripe_price_ids.length > 0) {
      for (let i = 0; i < subscription.addons_stripe_price_ids.length; i++) {
        payload.lineItems.push({
          price: subscription.addons_stripe_price_ids[i],
          quantity: 1
        });
      }
    }

    try {
      const session = await this.$axios.post(url, payload);
      stripe
        .redirectToCheckout({
          sessionId: session.data.id
        })
        .then(() => {
          // TODO: handle success if necessary
        })
        .catch((err) => {
          console.log('CHECKOUT_ERROR', err);
          this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'An unexpected error occurred!',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
          this.$router.push(
            `/m/${this.merchant.slug}/subscriptions/${
              this.subscription.subscription_id
            }/checkout`
          );
        });
    } catch (err) {
      console.log('SESSION_ERROR', err);
      this.$buefy.notification.open({
        duration: 2000,
        closable: false,
        animation: 'fade',
        message: 'An error occurred connecting to stripe!',
        position: 'is-bottom-right',
        type: 'is-primary'
      });
      this.$router.push(
        `/m/${this.merchant.slug}/subscriptions/${
          this.subscription.subscription_id
        }/checkout`
      );
    }
  }
};
</script>
