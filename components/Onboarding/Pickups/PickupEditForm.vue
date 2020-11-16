<template>
  <div>
    <div
      class="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 modal-card"
    >
      <div class="max-w-md w-full modal-card-body bg-gray-100">
        <div>
          <h2
            class="mt-3 text-center text-3xl leading-9 font-extrabold text-gray-900"
          >
            Edit Pickup ({{ pickup.name }})
          </h2>
        </div>
        <form class="mt-8" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm">
            <div class="grid grid-cols-6 w-full">
              <div class="col-span-6 w-full">
                <b-tooltip
                  label="Name of pickup location (internal use)"
                  class="w-full"
                  type="is-info"
                  position="is-bottom"
                >
                  <input
                    id="pickup-name"
                    v-model="editForm.name"
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
                  position="is-bottom"
                >
                  <input
                    id="pickup-title"
                    v-model="editForm.title"
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
                  position="is-bottom"
                >
                  <textarea
                    id="pickup-description"
                    v-model="editForm.description"
                    placeholder="Pickup description"
                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </b-tooltip>
              </div>
              <div class="col-span-6 sm:col-span-3">
                <b-tooltip
                  label="Zip/postcode of pickup location"
                  class="w-full"
                  type="is-info"
                  position="is-bottom"
                >
                  <input
                    id="zip-code"
                    v-model="editForm.location.zip"
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
                  position="is-bottom"
                >
                  <input
                    id="city"
                    v-model="editForm.location.city"
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
                  position="is-bottom"
                >
                  <input
                    id="state"
                    v-model="editForm.location.state"
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
                  position="is-bottom"
                >
                  <input
                    id="Country"
                    v-model="editForm.location.country"
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
                  position="is-bottom"
                >
                  <input
                    id="address"
                    v-model="editForm.location.address"
                    placeholder="Address"
                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </b-tooltip>
              </div>
              <div
                class="relative col-span-6 w-full flex flex-row items-center mt-2"
              >
                <div
                  class="w-full mb-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  @click="showProductsModalEdit"
                >
                  <span class="text-gray-600 font-medium">Select products</span>
                  <span v-if="editForm.product_ids.length !== 0"
                    >({{ editForm.product_ids.length }})</span
                  >
                  <div
                    class="absolute top-0 mt-2 right-0 px-2 text-gray-700 text-lg font-semibold"
                  >
                    <span>+</span>
                  </div>
                </div>
                <b-modal
                  :active.sync="showProductsEdit"
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
                          @click="showProductsModalEdit"
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
                          {{ editForm.product_ids.length }} SELECTED
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
                                v-model="editForm.product_ids"
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
              </div>
               <div
                class="relative col-span-6 w-full flex flex-row items-center mt-2"
              >
              <div
                 class="w-full mb-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                @click="showWeekdays = !showWeekdays"
              >    
                <span class="text-gray-600 font-medium">Select Days</span>
                <div
                  class="absolute top-0 mt-2 right-0 px-2 text-gray-700 text-lg font-semibold"
                >
                  <span>+</span>
                </div>
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
                <pick-days v-model="selectedDays" :initDays="initDays" @close="showWeekdays = !showWeekdays" />
              </b-modal>
              <div class="col-span-6 flex flex-row justify-between px-3">
                <div class="w-full">
                  <div class="flex flex-row">
                    <b-tooltip
                      label="Time when the location opens"
                      class="w-full"
                      type="is-info"
                      position="is-top"
                    >
                      <input
                        v-model="startEdit"
                        type="range"
                        name
                        min="0"
                        max="48"
                        step="1"
                        @input="getTimesOfDays(minVal, 'startEdit')"
                      />
                    </b-tooltip>
                    <b-tooltip
                      label="Time when the location closes"
                      class="w-full"
                      type="is-info"
                      position="is-top"
                    >
                      <input
                        v-model="endEdit"
                        type="range"
                        name
                        min="0"
                        max="48"
                        step="1"
                        @input="getTimesOfDays(maxVal, 'endEdit')"
                      />
                    </b-tooltip>
                  </div>
                  <div class="flex flex-row justify-between">
                    <span>Start time: {{ editForm.start_time }}</span>
                    <span>End time: {{ editForm.end_time }}</span>
                  </div>
                </div>
              </div>

              <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                <span class="text-xs text-red-700 font-semibold font-ubuntu">{{
                  errorMessage
                }}</span>
              </div>
              <div class="col-span-6 w-full mt-6 mb-2">
                <button
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                  @click.prevent="editPickup(pickup.pickup_id)"
                >
                  <span v-if="isLoading">Updating...</span>
                  <span v-else>Update pickup</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    pickup: {
      type: Object,
      default: {},
    },
    products:{
      type: Array,
      default: () => []
    } 
  },
  data: () => ({
    editForm: {
      name: "",
      title: "",
      description: "",
      location: {
        zip: "",
        state: "",
        city: "",
        country: "",
        address: "",
      },
      store_id: "",
      product_ids: [],
      days_of_week: [],
      start_time: "",
      end_time: "",
      updated_at: "",
    },
    showProductsEdit: false,
    selectAllText: "Select All",
    allSelected: false,
    minVal: "",
    maxVal: "",
    isLoading: false,
    errorMessage: "",
    error: false,
    showWeekdays: false,
    selectedDays: [],
    initDays: []
  }),
  computed: {
    ...mapState(["token", "store"]),
    startEdit: {
      set(val) {
        this.minVal = val;
      },
      get() {
        return this.minVal;
      },
    },
    endEdit: {
      set(val) {
        this.maxVal = val;
      },
      get() {
        return this.maxVal;
      },
    },
  },

  watch: {
    pickup: {
      handler() {
        this.editForm.name = this.pickup.name;
        this.editForm.description = this.pickup.description;
        this.editForm.title = this.pickup.title;
        this.editForm.store_id = this.pickup.store_id;
        this.editForm.location.zip = this.pickup.location.zip;
        this.editForm.location.address = this.pickup.location.address;
        this.editForm.location.state = this.pickup.location.state;
        this.editForm.location.country = this.pickup.location.country;
        this.editForm.location.city = this.pickup.location.city;
        this.editForm.days_of_week = this.pickup.days_of_week;
        
        this.editForm.product_ids = this.pickup.product_ids;
        this.selectedDays = this.editForm.days_of_week.map((item) => item.day_of_week);
        if (this.editForm.days_of_week.length > 0) {
          this.editForm.start_time = this.editForm.days_of_week[0].start_time;
          this.editForm.end_time = this.editForm.days_of_week[0].end_time;
        }
        
        this.initDays = [...this.selectedDays];
        console.log("[pickup]", this.selectedDays);
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    showProductsModalEdit() {
      this.showProductsEdit = !this.showProductsEdit;
    },
    selectAll() {
      this.allSelected = !this.allSelected;
      this.selectAllText =
        this.selectAllText == "Select All" ? "Clear All" : "Select All";
      if (this.allSelected) {
        for (const item in this.products) {
          this.editForm.product_ids.push(this.products[item].product_id);
        }
      } else {
        this.editForm.product_ids = [];
      }
    },
    getTimesOfDays(val, range) {
      const items = [];
      for (let hour = 0; hour <= 24; hour++) {
        items.push([hour, 0]);
        items.push([hour, 30]);
      }

      const date = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      items.forEach((time, index) => {
        const [hour, minute] = time;
        date.setHours(hour);
        date.setMinutes(minute);
        const formattedDate = formatter.format(date);
        if (parseInt(val) === index) {
          switch (range) {
            case "startEdit":
              this.editForm.start_time = formattedDate;
              break;
            case "endEdit":
              this.editForm.end_time = formattedDate;
              break;
            default:
              console.log("invalid");
              break;
          }
        }
      });
    },

    async editPickup(pickup_id) {
      this.isLoading = true;
      const date = new Date();
      try {
        this.editForm.updated_at = date.toISOString();
         // set pickup to all products if no product is set
        if (this.editForm.product_ids.length < 1) {
          this.products.forEach((item) => {
            this.editForm.product_ids.push(item.product_id);
          });
        }

        this.editForm.days_of_week = this.selectedDays.map((item) => {
          return {
            day_of_week: item,
            start_time: this.editForm.start_time,
            end_time: this.editForm.end_time
          }
        });
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/pickups/${pickup_id}`,
          this.editForm,
          {
            headers: {
              "x-access-token": this.token,
            },
          }
        );

        // update localStorage after updating item
        this.$emit('updateLocalStorage');
        this.$emit('close');
        this.isLoading = false;
        this.maxVal = "";
        this.minVal = "";
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Pickup updated successfully.',
          position: 'is-bottom-right',
          type: 'is-success'
        });
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: "fade",
          message: "unable to update pickup.",
          position: "is-bottom-right",
          type: "is-primary",
        });
      }
    },
  },
};
</script>

<style>
</style>