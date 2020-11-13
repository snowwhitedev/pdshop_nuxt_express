<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0">
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="p-3 md:py-6 w-full mt-8 flex flex-col">
          <span class="text-lg font-semibold text-gray-800 mb-1">Settings</span>
          <span class="text-gray-600 text-base font-medium mb-2">Set shopping order steps</span>
          <div
            v-if="loading"
            class="w-full flex flex-col items-center bg-white text-gray-700 font-medium shadow-md rounded-t rounded-b-none p-3"
          >
            <span>Loading steps...</span>
          </div>
          <div
            v-for="(step, index) in stepData"
            :key="index"
            class="w-full flex flex-row justify-between bg-white shadow-md p-3"
          >
            <div class="text-sm">
              <span v-if="step.title === 'Select a Share'">Shares/Products/Services page</span>
              <span v-else-if="step.title === 'Location and Time'">Pickups page</span>
              <span v-else>{{ step.title }} page</span>
            </div>
            <div>
              <toggle
                v-model="step.active"
                :index="index"
                onText="Disable"
                offText="Enable"
                @state-change="updateState(step.title)"
              />
            </div>
          </div>
          <div class="w-full flex flex-row justify-between bg-white shadow-md p-3">
            <div class="text-sm">
              <span>Allow Coupons</span>
            </div>
            <div>
              <toggle
                v-model="store.coupons_enabled"
                :index="6"
                onText="Disable"
                offText="Enable"
                @state-change="updateCouponAvailability()"
              />
            </div>
          </div>
        </div>
        <div class="p-3 w-full">
          <div>
            <span
              class="text-gray-700 text-base font-medium mb-2"
            >Update store logo and cover image for shop front</span>
            <div class="w-full flex flex-col justify-between bg-white shadow-md p-3 mt-1">
              <div class="flex flex-col md:flex-row">
                <div class="py-2 px-3 text-sm">
                  <label for="logo">Store Logo (optional)</label>
                  <input
                    ref="logo"
                    type="file"
                    class="mt-1 form-input block w-full border border-none rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    @change="onSelectFileForLogo"
                  >
                </div>
                <div class="py-2 px-3 text-sm">
                  <label for="bgImage">Background Image (optional)</label>
                  <input
                    ref="bgImage"
                    type="file"
                    class="mt-1 ml-1 form-input block w-full border border-none rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    @change="onSelectFileForBgImage"
                  >
                </div>
              </div>
              <div class="px-3 mt-2">
                <button
                  class="rounded bg-red-700 text-white px-2 py-1 disabled:opacity-50"
                  :disabled="uploading"
                  @click="upload"
                >
                  <font-awesome-icon :icon="['fa', 'cloud-upload-alt']" />
                  <span v-if="uploading">Uploading...</span>
                  <span v-else>Upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import sidenav from '../../components/sidenav';
import toggle from '../../components/toggleButton';
export default {
  layout: 'none',
  components: {
    sidenav,
    toggle
  },
  data () {
    return {
      loading: false,
      uploading: false,
      stepData: [],
      selectedFileForLogo: null,
      selectedFileForBgImage: null,
      background_image: '',
      form: {
        logo: ''
      }
    };
  },
  computed: {
    ...mapState(['store', 'token', 'user'])
  },
  async created () {
    this.loading = true;
    const store = await this.$axios.get(`/stores/slug/${this.store.slug}`);

    this.stepData = store.data.store.steps;
    this.loading = false;
  },
  methods: {
    onSelectFileForLogo () {
      this.selectedFileForLogo = this.$refs.logo.files[0];
    },

    onSelectFileForBgImage () {
      this.selectedFileForBgImage = this.$refs.bgImage.files[0];
    },

    async upload () {
      const formData = new FormData();

      try {
        this.uploading = true;

        if (this.selectedFileForLogo) {
          formData.append('logo', this.selectedFileForLogo);
          const upload = await this.$axios.post(
            `/onboarding/stores/${this.user.store_id}/logo`,
            formData,
            {
              headers: { 'x-access-token': this.token }
            }
          );
          // strip url into parts to fetch file name
          const str = upload.data.data.location;
          const data = str.split('/');
          const file = data[5];
          this.form.logo = `${this.$config.CDN_URL}/logos/${file}`;

          await this.$axios.put(
            `/onboarding/stores/${this.store.store_id}`,
            { payload: this.form },
            {
              headers: {
                'x-access-token': this.token
              }
            }
          );
          formData.delete('logo');
          this.$refs.logo.value = '';
        }

        if (this.selectedFileForBgImage) {
          formData.append('bgImage', this.selectedFileForBgImage);
          const upload = await this.$axios.post(
            `/onboarding/stores/${this.user.store_id}/background_image`,
            formData,
            {
              headers: { 'x-access-token': this.token }
            }
          );
          // strip url into parts to fetch file name
          const str = upload.data.data.location;
          const data = str.split('/');
          const file = data[5];
          this.background_image = `${this.$config.CDN_URL}/backgrounds/${file}`;

          await this.$axios.put(
            `/onboarding/stores/${this.store.store_id}`,
            { payload: { background_image: this.background_image } },
            {
              headers: {
                'x-access-token': this.token
              }
            }
          );
          this.$refs.bgImage.value = '';
        }

        if (!this.selectedFileForLogo && !this.selectedFileForBgImage) {
          this.uploading = false;
          return this.openNotification('No files selected', 'is-primary');
        }

        const store = await this.$axios.get(`/stores/slug/${this.store.slug}`);
        this.$store.commit('setStore', store.data.store);
        this.uploading = false;
        return this.openNotification('Upload successful!', 'is-success');
      } catch (error) {
        this.uploading = false;
        console.log(error);
        return this.openNotification('update failed, try again!', 'is-primary');
      }
    },

    updateState (title) {
      this.stepData.forEach(async (step, index) => {
        if (step.title === title) {
          step.active = !step.active;
          this.stepData.splice(index, 1, step);
          try {
            await this.$axios.put(
              `/onboarding/stores/${this.store.store_id}`,
              { payload: { steps: JSON.stringify(this.stepData) } },
              {
                headers: {
                  'x-access-token': this.token
                }
              }
            );
          } catch {
            this.openNotification(
              'An unexpected error occurred!',
              'is-primary'
            );
          }
        }
      });
    },

    async updateCouponAvailability () {
      try {
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}`,
          { payload: { coupons_enabled: !this.store.coupons_enabled } },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        const store = await this.$axios.get(`/stores/slug/${this.store.slug}`);
        this.$store.commit('setStore', store.data.store);
      } catch (error) {
        this.openNotification('An unexpected error occurred!', 'is=primary');
      }
    },

    openNotification (message, type, duration = 2000) {
      this.$buefy.notification.open({
        duration,
        closable: false,
        animation: 'fade',
        message,
        position: 'is-bottom-right',
        type
      });
    }
  }
};
</script>
