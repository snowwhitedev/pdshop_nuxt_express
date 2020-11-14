<template>
  <div class="w-full flex flex-col items-center">
    <div class="w-full ml-2 md:absolute md:top-0 md:mt-2">
      <button
        class="py-2 px-4 float-left border border-transparent text-xl leading-5 font-semibold text-gray-700 focus:outline-none transition duration-150 ease-in-out"
        @click="$emit('ontoggle')"
      >
        <span class>
          <font-awesome-icon :icon="['fa', 'arrow-left']" />
        </span>
      </button>
    </div>
    <div class="lg:w-3/4 md:w-3/4 lg:p-40 w-full p-5 lg:pt-5">
      <p class="flex flex-row row-gap-3 text-xl font-semibold mb-3">
        <img src="/plus.svg" alt class="h-6 w-6 mt-1 mr-2" />
        Create pickup locations
      </p>
      <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
        <div class="grid grid-cols-6 w-full">
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Name of pickup location (internal use)"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="pickup-name"
                v-model="form.name"
                placeholder="Pickup name"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="The name displayed to your customers"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="pickup-title"
                v-model="form.title"
                placeholder="Pickup title"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Describe the location"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <textarea
                id="pickup-description"
                v-model="form.description"
                placeholder="Pickup description"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <b-tooltip
              label="Zip/postcode of the location"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="zip-code"
                v-model="form.location.zip"
                placeholder="Zip code"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <b-tooltip
              label="City where pickup location is sited"
              class="w-full"
              type="is-info"
              position="is-right"
            >
              <input
                id="city"
                v-model="form.location.city"
                placeholder="City"
                class="mt-2 ml-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="State where pickup location is sited"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="state"
                v-model="form.location.state"
                placeholder="State"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Country where pickup location is sited"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="country"
                v-model="form.location.country"
                placeholder="Country"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="col-span-6 w-full">
            <b-tooltip
              label="Full address of the pickup location"
              class="w-full"
              type="is-info"
              position="is-left"
            >
              <input
                id="address"
                v-model="form.location.address"
                placeholder="Address"
                class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </b-tooltip>
          </div>
          <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
            <div
              class="w-full mb-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              @click="showProducts = !showProducts"
            >    
              <span class="text-gray-600 font-medium">Select products</span>
              <span v-if="form.product_ids.length !== 0"
                >({{ form.product_ids.length }})</span
              >
              <div
                class="absolute top-0 mt-2 right-0 px-2 text-gray-700 text-lg font-semibold"
              >
                <span>+</span>
              </div>
            </div>
            <b-modal
              :active.sync="showProducts"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-modal
            >
              <div class="modal-card">
                <div
                  id="dropdown"
                  class="w-full block p-3 shadow-md modal-card-body bg-gray-200"
                >
                  <div class="flex flex-row w-full mb-2">
                    <div class="w-full flex flex-col items-center">
                      <span class="text-xl text-gray-600 font-semibold"
                        >Select products</span
                      >
                    </div>
                    <span
                      class="rounded px-2 py-1 bg-red-700 text-white float-right cursor-pointer"
                      @click="showProducts = !showProducts"
                      >Done</span
                    >
                  </div>
                  <div class="flex flex-row justify-between">
                    <label class="flex flex-row justify-start items-start">
                      <div
                        class="select-none cursor-pointer mr-1 uppercase text-sm font-semibold"
                      >
                        {{ selectAllText }}
                      </div>
                      <div
                        class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                      >
                        <input
                          id="selectAll"
                          v-model="allSelected"
                          type="checkbox"
                          class="opacity-0 absolute cursor-pointer"
                          @click="selectAll"
                        />
                        <svg
                          class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    </label>
                    <div class="text-sm font-semibold">
                      {{ form.product_ids.length }} SELECTED
                    </div>
                  </div>
                  <ul id="customScroll" data-simplebar-auto-hide="false">
                    <li
                      v-for="(product, index) in products"
                      :key="index"
                      class="border border-t-0 border-r-0 border-l-0 border-b"
                    >
                      <label class="flex justify-start items-start">
                        <div
                          class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                        >
                          <input
                            :id="index"
                            v-model="form.product_ids"
                            type="checkbox"
                            :value="product.product_id"
                            class="opacity-0 absolute cursor-pointer"
                          />
                          <svg
                            class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                            viewBox="0 0 20 20"
                          >
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <div class="select-none cursor-pointer">
                          {{ product.name }}
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </b-modal>
            <div
              class="relative w-full mb-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              @click="showWeekdays = !showWeekdays"
            >    
              <span class="text-gray-600 font-medium">Select Days</span>
              <div
                class="absolute top-0 mt-2 right-0 px-2 text-gray-700 text-lg font-semibold"
              >
                <span>+</span>
              </div>
            </div>
            <b-modal
              :active.sync="showWeekdays"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-modal
            >
              <pick-days v-model="selectedDays" @close="showWeekdays = !showWeekdays" />
            </b-modal>
            <div class="col-span-6 flex flex-row w-full justify-between px-3">
              <div class="w-full">
                <div class="flex flex-row">
                  <b-tooltip
                    label="Time when the location opens"
                    class="w-full"
                    type="is-info"
                    position="is-top"
                  >
                    <input
                      v-model="start"
                      type="range"
                      name
                      min="0"
                      max="48"
                      step="1"
                      @input="getTimesOfDays(minVal, 'start')"
                    />
                  </b-tooltip>
                  <b-tooltip
                    label="Time when the location closes"
                    class="w-full"
                    type="is-info"
                    position="is-top"
                  >
                    <input
                      v-model="end"
                      type="range"
                      name
                      min="0"
                      max="48"
                      step="1"
                      @input="getTimesOfDays(maxVal, 'end')"
                    />
                  </b-tooltip>
                </div>
                <div class="flex flex-row justify-between">
                  <span>Start time: {{ form.start_time }}</span>
                  <span>End time: {{ form.end_time }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="error"
              class="col-span-6 w-full bg-red-200 p-2 rounded m-2"
            >
              <span class="text-xs text-red-700 font-semibold font-ubuntu">{{
                errorMessage
              }}</span>
            </div>
            <div class="col-span-6 w-full py-3">
              <button
                :disabled="incomplete"
                class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                @click="addPickup"
              >
                <span v-if="isLoading">Adding pickup...</span>
                <span v-else>Add pickup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { GET_STORE_PRODUCTS } from '@/store/types';
import PickDays from './PickDays.vue';
export default {
  components: {
    PickDays
  },
  props: {
    storeId: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    form: {
      name: '',
      title: '',
      description: '',
      location: {
        zip: '',
        state: '',
        city: '',
        country: '',
        address: ''
      },
      store_id: '',
      product_ids: [],
      days_of_week: [],
      start_time: '',
      end_time: ''
    },
    showProducts: false,
    showWeekdays: false,
    selectAllText: 'Select All',
    allSelected: false,
    minVal: '',
    maxVal: '',
    error: false,
    errorMessage: '',
    isLoading: false,
    incomplete: false,
    selectedDays: []
  }),
  computed: {
    ...mapState(['token']),
    ...mapGetters('modules/storeProducts', { products: `${GET_STORE_PRODUCTS}` }),
    start: {
      set (val) {
        this.minVal = val;
      },
      get () {
        return this.minVal;
      }
    },
    end: {
      set (val) {
        this.maxVal = val;
      },
      get () {
        return this.maxVal;
      }
    }
  },
  methods: {
    getTimesOfDays (val, range) {
      const items = [];
      for (let hour = 0; hour <= 24; hour++) {
        items.push([hour, 0]);
        items.push([hour, 30]);
      }

      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      });

      items.forEach((time, index) => {
        const [hour, minute] = time;
        date.setHours(hour);
        date.setMinutes(minute);
        const formattedDate = formatter.format(date);

        if (parseInt(val) === index) {
          switch (range) {
            case 'start':
              this.form.start_time = formattedDate;
              break;
            case 'end':
              this.form.end_time = formattedDate;
              break;
            default:
              console.log('invalid');
              break;
          }
        }
      });
    },
    validateFormFields () {
      if (this.form.name === '' ||
          this.form.title === '' ||
          this.form.description === '' ||
          this.form.location.zip === '' ||
          this.form.location.address === '' ||
          this.form.location.state === '' ||
          this.form.location.country === '' ||
          this.form.location.city === '' ||
          this.selectedDays.length === 0
      ) {
        this.error = true;
        this.errorMessage = 'All form fields are required';
        this.isLoading = false;
        return false;
      }
      return true;
    },
    selectAll () {
      this.allSelected = !this.allSelected;
      this.selectAllText =
        this.selectAllText == 'Select All' ? 'Clear All' : 'Select All';
      if (this.allSelected) {
        for (const item in this.products) {
          this.form.product_ids.push(this.products[item].product_id);
        }
      } else {
        this.form.product_ids = [];
      }
    },
    async addPickup () {
      this.isLoading = true;
      const validate = this.validateFormFields();

      if (validate) {
        try {
        // set pickup to all products if no product is set
          if (this.form.product_ids.length < 1) {
            this.products.forEach((item) => {
              this.form.product_ids.push(item.product_id);
            });
          }
          this.form.store_id = this.storeId
          this.form.days_of_week = this.selectedDays.map((item) => {
            return {
              day_of_week: item,
              start_time: this.form.start_time,
              end_time: this.form.end_time
            }
          });
          await this.$axios.post(
            `/onboarding/stores/${this.storeId}/mdpickups`,
            this.form, {
              headers: {
                'x-access-token': this.token
              }
            }
          );
          // update localStorage after updating item
          this.$emit('updateLocalStorage');
          this.isLoading = false;
          this.error = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Pickup created successfully.',
            position: 'is-bottom-right',
            type: 'is-success'
          });
        } catch (error) {
          this.error = true;
          this.errorMessage = 'An unexpected error occurred';
          this.isLoading = false;
          console.log(error);
        } finally {
          this.form.name = '';
          this.form.title = '';
          this.form.description = '';
          this.form.days_of_week = [];
          this.selectedDays = [];
          this.form.start_time = '';
          this.form.end_time = '';
          this.form.location.zip = '';
          this.form.location.city = '';
          this.form.location.state = '';
          this.form.location.address = '';
          this.form.location.country = '';
          this.form.product_ids = [];
          this.maxVal = '';
          this.minVal = '';
        }
      }
    },

  }
};
</script>

<style>
</style>
