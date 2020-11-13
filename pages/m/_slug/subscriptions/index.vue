<template>
  <div>
    <div class="columns is-centered ">
      <div class="column is-10">
        <h1 class="title is-3 has-text-centered">
          My Subscriptions
        </h1>
        <div class="columns is-centered is-mobile">
          <div class="column is-narrow">
            <figure class="image is-128x128">
              <img :src="merchant.logo">
            </figure>
          </div>
        </div>
        <h2 class="subtitle has-text-weight-bold has-text-centered">
          {{ merchant.name }}
        </h2>
        <div class="columns is-multiline">
          <div
            v-for="(subscription_item, index) in subscriptions"
            :key="index"
            class="column is-full"
          >
            <Featured v-if="subscriptionsLoaded">
              <div class="columns is-mobile">
                <div class="column">
                  <p v-if="subscription_item.summary.product" class="is-size-7 has-text-weight-bold">
                    {{ subscription_item.summary.product.title }}
                  </p>
                </div>
                <div class="column is-narrow">
                  <b-button
                    tag="router-link"
                    :type="subscription_item.is_complete ? 'is-warning' : 'is-dark'"
                    size="is-small"
                    :to="
                      subscription_item.is_complete
                        ? `/m/${merchant.slug}/subscriptions/${subscription_item.subscription_id}/checkout`
                        : `/m/${merchant.slug}/subscriptions/${subscription_item.subscription_id}/share`
                    "
                  >
                    {{ subscription_item.is_complete ? "Update" : "Customize" }}
                  </b-button>
                </div>
              </div>

              <hr>
              <div
                class="columns"
              >
                <div
                  class="column is-narrow"
                >
                  <div
                    class="has-text-centered tag has-text-white"
                    :class="
                      subscription_item.is_complete ? 'has-background-success' : 'has-background-danger'"
                  >
                    <p class="is-size-7 has-text-weight-semibold">
                      {{ subscription_item.is_complete ? "Completed" : "Pending" }}
                    </p>
                  </div>
                </div>
                <div class="column">
                  <div>
                    <p v-if="subscription_item.summary.product" class="is-size-7 has-text-grey is-capitalized">
                      {{ subscription_item.summary.product.description }}
                    </p>
                    <p v-else class="is-size-7 has-text-grey is-capitalized">
                      No product Selected
                    </p>
                  </div>
                </div>
              </div>
            </Featured>
          </div>
        </div>
        <section class="has-text-centered section">
          <b-button type="is-dark" @click="createSuscription()">
            New Subscription
          </b-button>
        </section>
      </div>
    </div>
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Featured from '~/components/Featured';
export default {
  name: 'Subscriptions',
  layout: 'shopping',
  components: {
    Featured
  },
  data () {
    return {
      subscriptions: [],
      isLoading: false,
      subscriptionsLoaded: false
    };
  },
  computed: {
    ...mapState('shopping', ['merchant', 'subscription'])
  },
  async mounted () {
    if (this.$route.query.Error) {
      this.getSubscriptionsByStore();
      return this.$buefy.notification.open({
        duration: 2000,
        closable: false,
        animation: 'fade',
        message: 'Error processing your subscription, please ensure to complete the checkout.',
        position: 'is-bottom-right',
        type: 'is-primary'
      });
    }

    if (this.$route.query.session_id) {
      // update subscription status to complete if stripe checkout succeeded
      try {
        await this.$axios.$put(
          `${this.$config.API_URL}/shop/subscriptions/${this.subscription.subscription_id}`,
          {
            is_complete: true,
            updated_at: new Date()
          }
        );
        this.getSubscriptionsByStore();

        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Subscription complete.',
          position: 'is-bottom-right',
          type: 'is-success'
        });
      } catch (e) {
        console.error(e.message);
      } finally {
        // Do Somethin
      }
    }

    this.getSubscriptionsByStore();
  },
  methods: {
    async getSubscriptionsByStore () {
      this.isLoading = true;
      try {
        const { subscriptions } = await this.$axios.$get(
          `${this.$config.API_URL}/stores/subscriptions/${this.merchant.store_id}`
        );

        this.subscriptions = subscriptions;
        if (this.subscriptions.length < 1) {
          this.$router.push({
            path: `/m/${this.merchant.slug}/share`
          });
        }

        await this.asyncForEach(this.subscriptions, async (subscription, index) => {
          const summary = await this.getSubscriptionSummary(
            subscription.subscription_id
          );
          subscription.summary = summary;
          if (index === this.subscriptions.length - 1) {
            this.subscriptionsLoaded = true;
          }
        });
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
        this.$router.push({
          path: `/m/${this.merchant.slug}/subscriptions/${createdSubscription_id}/share`
        });
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isLoading = false;
      }
    },

    async getSubscriptionSummary (id) {
      let subscriptionSummary = {};
      try {
        const { summary } = await this.$axios.$get(
          `${this.$config.API_URL}/shop/subscriptions/${id}`
        );
        subscriptionSummary = Object.assign(summary);
        return subscriptionSummary;
      } catch (e) {
        console.error(e.message);
      }
    },
    async asyncForEach (array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
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

<style lang="scss" scoped>
.column {
  .columns {
    .is-narrow {
      display: flex;
      align-items: center;
      align-content: center;
    }
  }
}

.columns {
  .column {
    .columns {
      margin: 0;
      .column.box {
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.level {
  margin-bottom: 0;
}

hr {
  margin: 0.75rem 0;
}

</style>
