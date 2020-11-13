<template>
  <div class="container is-fluid form-container">
    <div class="medium">
      <div>
        <h1>Reset Password</h1>
      </div>
      <form action="" @submit.prevent="">
        <b-field
          label="New Password"
          label-position="on-border"
          custom-class=" has-text-weight-semibold"
        >
          <b-input
            v-model="form.newPassword"
            type="password"
            placeholder="**********"
            minlength="8"
          />
        </b-field>
        <b-field
          label="Confirm Password"
          label-position="on-border"
          custom-class=" has-text-weight-semibold"
        >
          <b-input
            v-model="confirmPassword"
            type="password"
            placeholder="**********"
            minlength="8"
          />
        </b-field>
        <b-field>
          <b-button
            type="is-success"
            class="is-uppercase"
            expanded
            :disabled="!form.newPassword"
            :loading="isLoading"
            @click.prevent="reset"
          >
            Reset Password
          </b-button>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: false,
      form: {
        newPassword: ''
      },
      confirmPassword: ''
    };
  },

  methods: {
    async reset () {
      const token = this.$route.query.token;
      const slug = this.$route.params.slug;
      this.isLoading = true;
      if (this.form.newPassword !== this.confirmPassword) {
        this.isLoading = false;
        return this.$buefy.snackbar.open({
          message: 'Passwords do not match, try again',
          type: 'is-danger',
          position: 'is-top',
          actionText: 'close',
          duration: 5000,
          onAction: () => {
            this.$buefy.snackbar.isActive = false;
          }
        });
      }

      try {
        const res = await this.$axios.$post(`${this.$config.API_URL}/shop/users/auth/reset/${token}`, this.form);
        this.$buefy.snackbar.open({
          message: `${res}`,
          type: 'is-success',
          position: 'is-top',
          actionText: 'close',
          duration: 5000,
          onAction: () => {
            this.$buefy.snackbar.isActive = false;
          }
        });
        this.$router.replace(`/m/${slug}`);
      } catch (error) {
        this.$buefy.snackbar.open({
          message: 'Token has expired or invalid, try sending mail again!',
          type: 'is-danger',
          position: 'is-top',
          actionText: 'close',
          duration: 5000,
          onAction: () => {
            this.$buefy.snackbar.isActive = false;
          }
        });
        this.isLoading = false;
      } finally {
        this.confirmPassword = '';
        this.form.newPassword = '';
      }
    }
  }
};
</script>

<style scoped>
    .medium {
        margin-top: 8rem;
        margin-bottom: 5rem;
        width: 40%;
        display: inline-block;
    }

    .form-container {
        text-align: center;
    }

    h1 {
        font-size: x-large;
        font-weight: bold;
        margin-bottom: 3rem;
    }
</style>
