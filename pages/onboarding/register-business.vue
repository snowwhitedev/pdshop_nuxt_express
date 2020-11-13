<template>
  <div class="relative bg-gray-100 h-full overflow-hidden">
    <div class="relative pt-6 pb-12 sm:pb-32">
      <Header />
      <main class="mt-8 sm:mt-16 md:mt-20 lg:mt-24 h-full p-5">
        <div class>
          <div class>
            <div class="mt-10 sm:mt-0">
              <div class="w-full flex flex-col items-center">
                <div class="mt-5 md:mt-0 md:col-span-2">
                  <form action="#" method="POST">
                    <div class="shadow overflow-hidden sm:rounded-md">
                      <div class="px-4 py-5 bg-white sm:p-6">
                        <div class="w-full flex flex-col items-center px-4 pb-5 sm:px-0">
                          <h3
                            class="text-lg font-semibold leading-6 text-red-700"
                          >
                            Tell us about your business
                          </h3>
                        </div>
                        <div class="grid grid-cols-6 gap-6">
                          <div class="flex flex-col col-span-6">
                            <div>
                              <Toggle
                                v-model="store.is_production"
                                :index="1"
                                onText="Production mode"
                                offText="Demo mode"
                                @state-change="updateUserMode()"
                              />
                            </div>
                          </div>
                          <div class="flex flex-col col-span-6">
                            <p class="block text-sm font-medium leading-5 text-gray-700">
                              <span class="text-base text-red-700">*</span> Business type
                            </p>
                            <div class="col-span-6 flex flex-row text-sm md:text-base">
                              <div class="flex flex-row mr-3 md:mr-5">
                                <div class>
                                  <input
                                    id="individual"
                                    type="radio"
                                    name="businessType"
                                    :selected="true"
                                    required
                                    @change="handleClickInput('individual')"
                                  >
                                </div>
                                <label
                                  for="individual"
                                  class="ml-1 text-gray-900 font-semibold"
                                >Individual</label>
                              </div>
                              <div class="flex flex-row mr-3 md:mr-5">
                                <div class>
                                  <input
                                    id="non-profit"
                                    type="radio"
                                    name="businessType"
                                    required
                                    @change="handleClickInput('non-profit')"
                                  >
                                </div>
                                <label
                                  for="non-profit"
                                  class="ml-1 text-gray-900 font-semibold"
                                >Non-profit</label>
                              </div>
                              <div class="flex flex-row">
                                <div class>
                                  <input
                                    id="corporation"
                                    type="radio"
                                    name="businessType"
                                    required
                                    @change="handleClickInput('corporation')"
                                  >
                                </div>
                                <label
                                  for="corporation"
                                  class="ml-1 text-gray-900 font-semibold"
                                >Corporation</label>
                              </div>
                            </div>
                          </div>

                          <div class="col-span-6 sm:col-span-3">
                            <label
                              for="business-name"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >
                              <span class="text-base text-red-700">*</span> Business name
                            </label>
                            <input
                              id="business-name"
                              v-model="form.name"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            >
                          </div>

                          <div class="col-span-6 sm:col-span-3">
                            <label
                              for="slogan"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >
                              <span class="text-base text-red-700">*</span> Business Unique Identifier
                              <span class="inline text-sm font-small leading-1 text-gray-500">
                                This will be part of your unique url
                              </span>
                            </label>
                            <input
                              id="slogan"
                              v-model="form.title"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                              placeholder="my-amazing-service"
                              @blur="generateSlug"
                            >
                          </div>

                          <div class="col-span-6 sm:col-span-4">
                            <label
                              for="email_address"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >
                              <span class="text-base text-red-700">*</span> Email address
                            </label>
                            <input
                              id="email_address"
                              v-model="form.email"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            >
                          </div>

                          <div class="col-span-6">
                            <label
                              for="website"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >Website</label>
                            <input
                              id="website"
                              v-model="form.website"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            >
                          </div>

                          <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                            <label
                              for="phone"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >
                              <span class="text-base text-red-700">*</span> Phone
                            </label>
                            <input
                              id="phone"
                              v-model="form.phone"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            >
                          </div>

                          <div class="col-span-3 sm:col-span-3 lg:col-span-2">
                            <label
                              for="logo"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >Select Logo</label>
                            <input
                              ref="logo"
                              type="file"
                              class="mt-1 form-input block w-full py-2 px-3 border border-none rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                              @change="onSelectFileForLogo"
                            >
                          </div>

                          <div class="col-span-3 sm:col-span-3 lg:col-span-2">
                            <label
                              for="logo"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            >Select Cover image for shopping flow</label>
                            <input
                              ref="bgImage"
                              type="file"
                              class="mt-1 form-input block w-full py-2 px-3 border border-none rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                              @change="onSelectFileForBgImage"
                            >
                          </div>

                          <div class="col-span-6">
                            <label
                              for="description"
                              class="block text-sm font-medium leading-5 text-gray-700"
                            ><span class="text-base text-red-700">*</span> Business Description</label>
                            <textarea
                              id="description"
                              v-model="form.description"
                              cols="30"
                              rows="10"
                              class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            />
                          </div>
                        </div>
                      </div>
                      <div v-if="error" class="bg-red-200 p-2 rounded m-2">
                        <span
                          class="text-xs text-red-700 font-semibold font-ubuntu"
                        >{{ errorMessage }}</span>
                      </div>
                      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          :disabled="loading"
                          class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 shadow-sm hover:bg-red-600 disabled:opacity-50 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                          @click.prevent="RegisterBusiness"
                        >
                          <span v-if="loading">Connecting</span>
                          <span v-else>Connect to Stripe</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Toggle from '../../components/toggleButton';
export default {
  layout: 'none',
  components: {
    Footer,
    Header,
    Toggle
  },

  data () {
    return {
      isUniqueSlug: false,
      form: {
        name: '',
        title: '',
        business_type: '',
        slug: '',
        email: '',
        phone: '',
        website: '',
        logo: '',
        background_image: '',
        description: '',
        active: true
      },
      selectedFileForLogo: null,
      selectedFileForBgImage: null,
      userId: '',
      error: false,
      errorMessage: '',
      loading: false
    };
  },

  computed: {
    ...mapGetters({
      token: 'getToken',
      loggedIn: 'loggedIn'
    }),

    ...mapState(['user', 'store'])
  },

  created () {
    if (!this.loggedIn) {
      this.$router.push('/onboarding');
    }

    if (this.store.active) {
      this.$router.push('/onboarding/dashboard');
    }

    this.userId = this.user.user_id;
    this.form.phone = this.user.phone;
    this.form.email = this.user.email;
  },

  methods: {
    async generateSlug () {
      const slug = this.form.title.toLowerCase().replace(/\s/g, '-');
      this.form.title = slug;
      this.form.slug = slug;
      this.isUniqueSlug = await this.checkIfSlugIsTaken(slug, this.token);
    },

    async updateUserMode () {
      try {
        const store = await this.$axios
          .put(`/onboarding/stores/${this.user.store_id}`, { payload: { is_production: !this.store.is_production } }, {
            headers: { 'x-access-token': this.token }
          });

        this.$store.commit('setStore', store.data.store);
      } catch (error) {
        console.error(error);
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Error setting user mode, try again!',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    validateForm () {
      if (this.form.business_type === '' ||
          this.form.name === '' ||
          this.form.email === '' ||
          this.form.phone === '' ||
          this.form.business_type === '' ||
          this.form.description === '') {
        // missing form field
        this.error = true;
        this.errorMessage = 'Please fill in all required fields';
        return false;
      }

      const slugRe = RegExp(/^[a-zA-Z0-9-_]+$/);
      if (!this.form.slug || this.form.slug === '' || !this.form.slug.match(slugRe)) {
        this.error = true;
        this.errorMessage = 'Store Unique URL can contain only alphanumeric characters';
        return false;
      }

      return true;
    },

    onSelectFileForLogo () {
      this.selectedFileForLogo = this.$refs.logo.files[0];
    },

    onSelectFileForBgImage () {
      this.selectedFileForBgImage = this.$refs.bgImage.files[0];
    },

    async checkIfSlugIsTaken (slug, token) {
      try {
        const response = await this.$axios
          .get(`/onboarding/validate/slug/${slug}`, {
            headers: { 'x-access-token': token }
          });
        if (response.status === 409 || response.data.unique === false) {
          throw new Error('Business name is not unique');
        }
        return true;
      } catch (err) {
        this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Error Business Unique Identifier is taken. try a different name.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
        return false;
      }
    },

    async RegisterBusiness () {
      const formData = new FormData();
      const validate = this.validateForm();

      if (validate && this.isUniqueSlug) {
        this.loading = true;
        if (this.selectedFileForLogo) {
          formData.append('logo', this.selectedFileForLogo);
          let upload;
          try {
            upload = await this.$axios.post(`/onboarding/stores/${this.user.store_id}/logo`, formData, {
              headers: { 'x-access-token': this.token }
            });

            // strip url into parts to fetch file name
            const str = upload.data.data.location;
            const data = str.split('/');
            const file = data[5];
            this.form.logo = `${this.$config.CDN_URL}/logos/${file}`;
            formData.delete('logo');
          } catch (error) {
            this.loading = false;
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'An error occurred while uploading, please try again!',
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          }

          if (!upload.data.success) {
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'An error occurred, please try again!',
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          }
        }

        if (this.selectedFileForBgImage) {
          formData.append('bgImage', this.selectedFileForBgImage);
          let upload;
          try {
            upload = await this.$axios.post(`/onboarding/stores/${this.user.store_id}/background_image`, formData, {
              headers: { 'x-access-token': this.token }
            });

            // strip url into parts to fetch filename
            const str = upload.data.data.location;
            const data = str.split('/');
            const file = data[5];
            this.form.background_image = `${this.$config.CDN_URL}/backgrounds/${file}`;
          } catch (error) {
            this.loading = false;
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'An error occurred while uploading, please try again!',
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          }

          if (!upload.data.success) {
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'An error occurred, please try again!',
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          }
        }

        await this.$axios
          .put(`/onboarding/stores/${this.user.store_id}`, { payload: this.form, userId: this.userId }, {
            headers: { 'x-access-token': this.token }
          })
          .then((res) => {
            this.$store.commit('setStore', res.data.store);
            if (this.store.is_production) {
              window.location.href = this.$config.STRIPE_LIVE_CONNECT_URL + `&stripe_user[email]=${this.form.email}&stripe_user[business_name]=${this.form.name}`;
            } else {
              window.location.href = this.$config.STRIPE_TEST_CONNECT_URL + `&stripe_user[email]=${this.form.email}&stripe_user[business_name]=${this.form.name}`;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'Error registering store, try again!',
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          });
      }
    },

    handleClickInput (value) {
      this.form.business_type = value;
    }
  }
};
</script>
