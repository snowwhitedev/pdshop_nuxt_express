<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <sidenav />
    <div class="flex flex-col flex-1 w-0 overflow-hidden border border-t-0 border-b-0 border-r-0">
      <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none" tabindex="0">
        <div class="pt-2 pb-6 mt-6 md:py-6">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <!-- Replace with your content -->
            <div class="py-4">
              <div class="flex flex-col h-96">
                <div
                  class="flex flex-wrap justify-between w-full p-3 text-base text-gray-700 bg-white rounded shadow-lg lg:flex-row md:flex-row sm:flex-col"
                >
                  <div class="mb-1">
                    <span class="mr-2 text-red-500">
                      <font-awesome-icon :icon="['fa', 'bell']" />
                    </span>
                    <span>Welcome {{ user.first_name }}, we are glad to have you here.</span>
                  </div>
                  <div>
                    <button
                      class="px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-red-700 border border-transparent rounded-md disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800"
                      @click="openModal"
                    >
                      <span>
                        <font-awesome-icon :icon="['fa', 'envelope']" />
                      </span>
                      <span>Invite Collaborator</span>
                    </button>
                  </div>
                </div>
                <div
                  class="flex flex-wrap justify-between w-full p-3 mt-2 text-base text-gray-800 bg-white rounded shadow-lg lg:flex-row md:flex-row sm:flex-col"
                >
                  <div class="mb-1">
                    <div class="mb-1 flex flex-row">
                      <span class="mr-2 text-gray-800">
                        <img src="/coupon.svg" height="48" width="48" alt>
                      </span>
                      <span
                        class="mt-2 font-semibold text-red-800"
                      >You can create coupons for promo and discount sales.</span>
                    </div>
                    <p class="text-sm">
                      Note: <span class="text-gray-600">To enable coupons on the shopping flow, you have to enable it on the
                        <router-link to="/onboarding/settings">
                          settings
                        </router-link> tab.</span>
                    </p>
                    <p class="text-sm font-semibold mt-1" @click="toggleCouponDiv">
                      <span v-if="openCouponForm" class="rounded cursor-pointer border border-gray-300 text-gray-700 px-2 py-1 bg-gray-100">Hide coupon form</span>
                      <span v-else class="rounded cursor-pointer border border-gray-300 text-gray-700 px-2 py-1 bg-gray-100">Show coupon form</span>
                    </p>
                  </div>
                  <div v-if="openCouponForm" class="grid grid-cols-4 sm:mt-1">
                    <div class="col-span-4">
                      <label class="flex flex-row items-start justify-start">
                        <div
                          class="ml-1 flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 bg-white border-2 border-gray-800 rounded focus-within:border-blue-500"
                        >
                          <input
                            id="selectAll"
                            v-model="couponForm.stripePayload.isPercent"
                            type="checkbox"
                            class="absolute opacity-0 cursor-pointer"
                            @click="checkPercent"
                          >
                          <svg
                            class="hidden w-4 h-4 text-red-700 pointer-events-none fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <div
                          class="mr-1 text-sm font-medium cursor-pointer select-none"
                        >Set discount rate in percentage</div>
                      </label>
                    </div>
                    <div class="col-span-4 md:col-span-2">
                      <b-tooltip
                        label="Coupon title"
                        class="w-full"
                        type="is-info"
                        position="is-left"
                      >
                        <input
                          id="coupon_name"
                          v-model="couponForm.internalPayload.name"
                          type="text"
                          placeholder="Coupon name"
                          class="block w-full px-3 py-2 m-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        >
                      </b-tooltip>
                    </div>
                    <div class="col-span-4 md:col-span-2">
                      <b-tooltip
                        label="Duration the coupon will be valid"
                        class="w-full"
                        type="is-info"
                        position="is-top"
                      >
                        <input
                          id="duration_in_months"
                          v-model="couponForm.stripePayload.duration_in_months"
                          type="text"
                          placeholder="Duration in months"
                          class="block w-full px-3 py-2 m-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        >
                      </b-tooltip>
                    </div>
                    <div class="col-span-4 md:col-span-2">
                      <b-tooltip
                        label="coupon amount"
                        class="w-full"
                        type="is-info"
                        position="is-left"
                      >
                        <input
                          id="amount"
                          v-model="couponForm.internalPayload.amount"
                          type="text"
                          placeholder="Enter amount"
                          class="block w-full px-3 py-2 m-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        >
                      </b-tooltip>
                    </div>
                    <div class="col-span-4 md:col-span-2">
                      <b-tooltip
                        label="coupon expiry date"
                        class="w-full"
                        type="is-info"
                        position="is-bottom"
                      >
                        <input
                          id="expiry"
                          v-model="couponForm.internalPayload.expires"
                          type="date"
                          class="block w-full px-3 py-2 m-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        >
                      </b-tooltip>
                    </div>
                    <div class="ml-1 col-span-3">
                      <b-tooltip
                        label="coupon code"
                        class="w-full"
                        type="is-info"
                        position="is-bottom"
                      >
                        <input
                          id="coupon_code"
                          v-model="couponForm.internalPayload.code"
                          type="text"
                          placeholder="Enter custom code"
                          class="block w-full px-3 py-2 rounded-r-none transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                        >
                      </b-tooltip>
                    </div>

                    <div class="mr-1 col-span-1">
                      <b-tooltip
                        label="Auto generate coupon code"
                        class="w-full h-full"
                        type="is-info"
                        position="is-bottom"
                      >
                        <button
                          class="w-full px-4 py-2 rounded-l-none text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-gray-200 border border-gray-400 border-l-0 rounded-md focus:outline-none focus:shadow-outline-blue active:bg-gray-800"
                          @click="autoGen"
                        >
                          <span>
                            <font-awesome-icon :icon="['fa', 'sync-alt']" />
                          </span>
                        </button>
                      </b-tooltip>
                    </div>
                    <div v-if="error" class="col-span-4 p-2 m-2 bg-red-200 rounded">
                      <span
                        class="text-xs font-semibold text-red-700 font-ubuntu"
                      >{{ errorMessage }}</span>
                    </div>
                    <div class="col-span-4">
                      <button
                        :disabled="isLoading"
                        class="w-full px-4 py-2 mt-1 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-red-700 border border-transparent rounded-md disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800"
                        @click="createCoupon"
                      >
                        <span>
                          <font-awesome-icon :icon="['fa', 'award']" />
                        </span>
                        <span v-if="isLoading">Creating coupon...</span>
                        <span v-else>Create coupon</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-full gap-8 p-3 mt-2 lg:grid lg:grid-cols-6 md:items-center"
              >
                <div class="bg-white rounded shadow-md lg:col-span-3 md:w-full">
                  <div class="flex flex-col items-center w-full">
                    <span class="text-base font-semibold text-gray-800">PRODUCTS</span>
                  </div>
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          S/N
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Name
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(product, index) in products" :key="index">
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ index+1 }}.
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ product.name }}
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ product.description.length > 50 ? product.description.slice(0, 50) + '...' : product.description }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="products.length > 0" class="flex flex-col items-center w-full p-3">
                    <router-link to="/onboarding/products">
                      view more
                      <font-awesome-icon :icon="['fa', 'arrow-right']" />
                    </router-link>
                  </div>
                  <div v-else class="flex flex-col items-center w-full p-3">
                    <span>No data available.</span>
                  </div>
                </div>
                <div class="bg-white rounded shadow-md lg:col-span-3 md:w-full">
                  <div class="flex flex-col items-center w-full">
                    <span class="text-base font-semibold text-gray-800">PICKUPS</span>
                  </div>
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          S/N
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Name
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(pickup, index) in pickups" :key="index" class="table-row">
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ index+1 }}.
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ pickup.name }}
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ pickup.description.length > 50 ? pickup.description.slice(0, 50) + '...' : pickup.description }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="pickups.length > 0" class="flex flex-col items-center w-full p-3">
                    <router-link to="/onboarding/pickups">
                      view more
                      <font-awesome-icon :icon="['fa', 'arrow-right']" />
                    </router-link>
                  </div>
                  <div v-else class="flex flex-col items-center w-full p-3">
                    <span>No data available.</span>
                  </div>
                </div>
                <div class="bg-white rounded shadow-md lg:col-span-3 md:w-full">
                  <div class="flex flex-col items-center w-full">
                    <span class="text-base font-semibold text-gray-800">COUPONS</span>
                  </div>
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          S/N
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Coupon code
                        </th>
                        <th
                          class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                        >
                          Expiry
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(coupon, index) in coupons" :key="index">
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ index+1 }}.
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ coupon.code }}
                        </td>
                        <td
                          class="px-1 py-1 text-sm bg-white border-b border-gray-200"
                        >
                          {{ formatDate(coupon.expires) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="coupons.length > 0" class="flex flex-col items-center w-full p-3">
                    <router-link to="/onboarding/coupons">
                      view more
                      <font-awesome-icon :icon="['fa', 'arrow-right']" />
                    </router-link>
                  </div>
                  <div v-else class="flex flex-col items-center w-full p-3">
                    <span>No data available.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /End replace -->
        </div>
      </main>
    </div>
    <b-modal
      :active.sync="makeModal"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <div>
        <div class="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8 modal-card">
          <div class="w-full max-w-md bg-gray-100 modal-card-body">
            <div>
              <img class="w-auto h-12 mx-auto" src="@/assets/logo1.png" alt="logo">
              <h2
                class="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900"
              >
                Invite merchant
              </h2>
            </div>
            <form class="mt-8" action="#" method="POST">
              <input type="hidden" name="remember" value="true">
              <div class="rounded-md shadow-sm">
                <div class>
                  <input
                    id="email"
                    v-model="form.email"
                    placeholder="Email"
                    class="block w-full px-3 py-2 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </div>
                <div class>
                  <input
                    id="first-name"
                    v-model="form.first_name"
                    placeholder="First name"
                    class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </div>
                <div class>
                  <input
                    id="last-name"
                    v-model="form.last_name"
                    placeholder="Last name"
                    class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </div>

                <div v-if="error" class="w-full p-2 m-2 bg-red-200 rounded">
                  <span class="text-xs font-semibold text-red-700 font-ubuntu">{{ errorMessage }}</span>
                </div>
                <div class="mt-6">
                  <button
                    class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                    @click.prevent="sendInvite"
                  >
                    <span v-if="isLoading">Sending...</span>
                    <span v-else>Send invite</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </b-modal>
    <!-- </Modal> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import sidenav from '../../components/sidenav';
export default {
  layout: 'none',
  components: {
    sidenav
  },
  data () {
    return {
      makeModal: false,
      openCouponForm: false,
      error: false,
      isLoading: false,
      errorMessage: '',
      products: [],
      pickups: [],
      subscriptions: [],
      coupons: [],
      form: {
        email: '',
        first_name: '',
        last_name: '',
        user_type: 'merchant',
        store_id: ''
      },
      couponForm: {
        stripePayload: {
          isPercent: false,
          id: '',
          duration_in_months: '',
          duration: 'repeating',
          amount: '',
          expires: ''
        },
        internalPayload: {
          isPercent: false,
          is_active: true,
          amount: '',
          expires: '',
          name: '',
          store_id: '',
          code: ''
        }
      }
    };
  },
  computed: {
    ...mapState(['user', 'store', 'token'])
  },
  async created () {
    if (!this.store.active) {
      this.$router.push('/onboarding/register-business');
    }

    this.form.store_id = this.user.store_id;
    this.couponForm.internalPayload.store_id = this.user.store_id;
    try {
      const pickupData = await this.$axios.get(
        `/onboarding/stores/${this.user.store_id}/pickups?limit=5&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );

      const productData = await this.$axios.get(
        `/stores/${this.user.store_id}/products?limit=5&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );

      const subscriptionData = await this.$axios.get(
        `/stores/subscriptions/${this.user.store_id}/subscriptions?limit=5&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );

      const coupons = await this.$axios.get(
        `/onboarding/stores/${this.user.store_id}/coupons?limit=5&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );
      this.coupons = coupons.data.coupons;
      this.products = productData.data.products;
      this.pickups = pickupData.data.pickups;
      this.subscriptions = subscriptionData.data.subscriptions;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    toggleCouponDiv () {
      this.openCouponForm = !this.openCouponForm;
    },

    formatDate (date) {
      date = Date.parse(date);
      const formatter = Intl.DateTimeFormat();
      const newDate = formatter.format(date);

      return newDate;
    },

    checkPercent () {
      this.couponForm.stripePayload.isPercent = !this.couponForm.stripePayload
        .isPercent;
      this.couponForm.internalPayload.isPercent = !this.couponForm
        .internalPayload.isPercent;
    },

    validate () {
      const durationFormat = RegExp(/^[0-9]+$/);

      if (!this.couponForm.stripePayload.duration_in_months.match(durationFormat) || this.couponForm.stripePayload.duration_in_months > 12) {
        this.error = true;
        this.errorMessage = 'Duration must be a number, range [1-12]';
        return false;
      }

      if (this.couponForm.internalPayload.name === '' ||
        this.couponForm.internalPayload.amount === '' ||
        this.couponForm.internalPayload.expires === '' ||
        this.couponForm.internalPayload.code === ''
      ) {
        this.error = true;
        this.errorMessage = 'All fields are required.';
        return false;
      }

      if (this.couponForm.internalPayload.isPercent === true && parseInt(this.couponForm.internalPayload.amount) > 100) {
        this.error = true;
        this.errorMessage = 'Amount cannot be greater than 100 when setting amount in percentage.';
        return false;
      }

      return true;
    },

    openModal () {
      this.makeModal = true;
    },

    autoGen () {
      const codeLength = 13;
      let generatedCode = 'PD-';

      const charPool = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < codeLength; i++) {
        generatedCode += charPool.charAt(Math.floor(Math.random() * charPool.length));
      }
      this.couponForm.internalPayload.code = generatedCode.toUpperCase();
    },

    async createCoupon () {
      const validate = this.validate();

      if (validate) {
        this.isLoading = true;
        this.error = false;
        this.couponForm.stripePayload.id = this.couponForm.internalPayload.name;
        this.couponForm.stripePayload.amount = this.couponForm.internalPayload.amount;
        // eslint-disable-next-line new-cap
        this.couponForm.stripePayload.expires = Date.parse(this.couponForm.internalPayload.expires) / 1000;
        this.couponForm.internalPayload.code = this.couponForm.internalPayload.code.toUpperCase();
        try {
          const res = await this.$axios.post(
            `/onboarding/stores/${this.user.store_id}/coupon`,
            this.couponForm,
            {
              headers: {
                'x-access-token': this.token
              }
            }
          );
          const coupon = res.data.coupon;

          if (coupon.name) {
            this.isLoading = false;
            const coupons = await this.$axios.get(
              `/onboarding/stores/${this.user.store_id}/coupons?limit=5&offset=0`,
              {
                headers: {
                  'x-access-token': this.token
                }
              }
            );

            this.coupons = coupons.data.coupons;
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: 'Coupon created successfully.',
              position: 'is-bottom-right',
              type: 'is-success'
            });
          }
        } catch (error) {
          this.isLoading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Unexpected error while creating coupon, try again.',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        } finally {
          this.couponForm.internalPayload.name = '';
          this.couponForm.internalPayload.amount = '';
          this.couponForm.internalPayload.expires = '';
          this.couponForm.internalPayload.code = '';
          this.couponForm.stripePayload.duration_in_months = '';
        }
      }
    },

    async sendInvite () {
      this.isLoading = true;
      await this.$axios
        .post(`/onboarding/stores/${this.user.store_id}/invite`, this.form, {
          headers: {
            'x-access-token': this.token
          }
        })
        .then((res) => {
          this.isLoading = false;
          this.makeModal = false;
          if (res.userExist) {
            return this.$buefy.notification.open({
              duration: 2000,
              closable: false,
              animation: 'fade',
              message: "Can't send invite to existing user.",
              position: 'is-bottom-right',
              type: 'is-primary'
            });
          }

          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Invite sent successfully',
            position: 'is-bottom-right',
            type: 'is-success'
          });
        })
        .catch(() => {
          this.isLoading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Unable to send invite ',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        })
        .finally(() => {
          // unset form fields
          this.form.email = '';
          this.form.first_name = '';
          this.form.last_name = '';
        });
    }
  }
};
</script>

<style>
input:checked + svg {
  display: block;
}
</style>
