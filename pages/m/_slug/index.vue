<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div v-if="merchant" class="column is-10-desktop is-full-touch">
        <SubscriptionSteps :path="'/'" :slug="slug">
          <template v-slot:welcome>
            <h2 class="subtitle has-text-weight-bold is-capitalized has-text-left">
              {{ merchant.name }}
            </h2>
            <p class="has-text-left is-capitalized">
              {{ merchant.sub_title }}
            </p>
            <br>
            <EmailForm :merchant="merchant" />
          </template>
        </SubscriptionSteps>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EmailForm from '~/components/EmailForm';
import SubscriptionSteps from '~/components/SubscriptionSteps';
export default {
  layout: 'shopping',
  components: {
    EmailForm,
    SubscriptionSteps
  },
  data () {
    return {
      slug: this.$route.params.slug
    };
  },
  computed: {
    ...mapState(
      'shopping',
      [
        'merchant',
        'loggedIn'
      ]
    )
  },
  mounted () {
    if (this.loggedIn) {
      const slug = this.$route.params.slug;
      if (slug !== this.merchant.slug) {
        this.getMerchantBySlug(slug);
      }
      this.$router.push({ path: `/m/${this.merchant.slug}/subscriptions/` });
    } else {
      this.getMerchantBySlug(this.$route.params.slug);
    }
  },
  methods: {
    ...mapActions('shopping',
      [
        'getMerchantBySlug'
      ]
    ),
    saveEmail () {
      // Check if email is valid
      if (!this.isEmailValid(this.email)) {
        alert('Email is not valid');
      }
      this.$store.commit('saveEmail', this.email);
      this.$router.push(this.url);
    },
    isEmailValid (emailText) {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return emailText.match(mailformat);
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

<style></style>
