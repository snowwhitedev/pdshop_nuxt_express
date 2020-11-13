<template>
  <div class="is-centered">
    <div v-if="error" class="mb-2">
      <span class="text-base font-semibold text-red-700">
        * {{ errorMessage }}
      </span>
    </div>
    <form action="" @submit.prevent="">
      <b-field
        label="Email Address"
        label-position="on-border"
        custom-class="is-capitalized has-text-weight-light is-size-6"
      >
        <b-input
          v-model="userInfo.email"
          type="email"
          placeholder="example@mail.com"
          custom-class="is-size-5"
          @keyup.enter.native="validateNewUser"
        />
      </b-field>
      <b-field
        v-if="userInfo.isRegistered"
        label="Password"
        label-position="on-border"
        custom-class="is-capitalized has-text-weight-light is-size-6"
      >
        <b-input
          v-model="userInfo.password"
          size="is-large"
          type="password"
          placeholder="Must have at least N characters."
          custom-class="is-size-5"
        />
      </b-field>
      <div>
        <a href="#" @click="modalState = true">Forgot Password?</a>
      </div>
      <br>
      <b-field v-if="!userInfo.isRegistered">
        <b-button
          type="is-dark"
          class="is-capitalized"
          size="is-large"
          expanded
          :disabled="!userInfo.email"
          :loading="isLoggingIn"
          @click.prevent="validateNewUser"
        >
          View plans + pricing
        </b-button>
      </b-field>
      <b-field v-else>
        <b-button
          type="is-dark"
          class="is-capitalized"
          size="is-large"
          expanded
          :disabled="!userInfo.password"
          :loading="isLoggingIn"
          @click.prevent="loginUser"
        >
          Next
        </b-button>
      </b-field>
    </form>
    <b-modal
      :active.sync="modalState"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <form action="">
        <div class="modal-card" style="width: 24rem">
          <header class="modal-card-head">
            <p class="modal-card-title">
              Reset password
            </p>
          </header>
          <section class="modal-card-body">
            <b-field label="Email">
              <b-input
                v-model="form.email"
                type="email"
                placeholder="Your email"
                required
              />
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="modalState = false">
              Close
            </button>
            <button class="button is-success" @click="sendMail">
              Send
            </button>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'EmailForm',
  props: {
    merchant: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      error: false,
      errorMessage: '',
      userInfo: {
        email: '',
        password: null,
        isRegistered: false
      },
      form: {
        email: ''
      },
      userValidation: null,
      modalState: false
    };
  },
  computed: {
    ...mapState('shopping',
      [
        'isLoggingIn'
      ]
    )
  },
  methods: {
    ...mapActions(
      'shopping',
      [
        'checkUser',
        'setLogin',
        'login'
      ]
    ),

    async sendMail () {
      const slug = this.$route.params.slug;
      try {
        const res = await this.$axios.$post(`${this.$config.API_URL}/shop/users/auth/reset?slug=${slug}`, this.form);
        this.$buefy.snackbar.open({
          message: `${res.success}`,
          type: 'is-success',
          position: 'is-top',
          actionText: 'close',
          duration: 5000,
          onAction: () => {
            this.$buefy.snackbar.isActive = false;
          }
        });
      } catch (error) {
        this.$buefy.snackbar.open({
          message: `${error.error}`,
          type: 'is-error',
          position: 'is-top',
          actionText: 'close',
          duration: 5000,
          onAction: () => {
            this.$buefy.snackbar.isActive = false;
          }
        });
      } finally {
        this.modalState = false;
        this.form.email = '';
      }
    },

    async validateNewUser () {
      try {
        const response = await this.checkUser(this.userInfo, this.merchant);
        this.userValidation = response;
        if (this.userValidation.code === 'UserExist') {
          this.userInfo.isRegistered = true;
        } else if (this.userValidation.code === 'UserRegister') {
          this.$store.commit('setUser', response.userRecord);
          this.setLogin(true);
          this.$router.push({
            path: `/m/${this.merchant.slug}/share`
          });
        }
      } catch (e) {
        console.error(e.message);
        this.error = true;
        this.errorMessage = 'Couldn\'t create account , try again';
        return this.errorMessage;
      }
    },

    async loginUser () {
      try {
        const response = await this.login(this.userInfo);
        if (response.code !== 'UserLogin') {
          this.error = true;
          this.errorMessage = 'Invalid login, try again';
          return this.errorMessage;
        }

        this.$store.commit('setUser', response.userRecord);
        this.setLogin(true);
        this.$router.push({ path: `/m/${this.merchant.slug}/subscriptions` });
      } catch (e) {
        console.error(e.message);
      }
    },

    async createSuscription () {
      let createdSubscription_id = null;
      try {
        const { subscription } = await this.$axios.$post(
          `${this.$config.API_URL}/shop/subscriptions/${this.merchant.store_id}`,
          {
            responseType: 'json'
          }
        );
        createdSubscription_id = subscription.subscription_id;
        return createdSubscription_id;
      } catch (e) {
        console.error(e.message);
      } finally {
        // Do Something
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
