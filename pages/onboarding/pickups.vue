<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div
      class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0"
    >
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="pt-2 pb-6 md:py-6">
          <div
            class="flex flex-col col-gap-4"
            :class="showPickupForm ? 'hidden' : 'block'"
          >
            <div class="w-full mt-5 p-8">
              <div class="w-full border border-t-0 border-l-0 border-r-0">
                <span
                  class="w-full flex flex-col items-center text-gray-800 font-semibold text-2xl mb-3"
                  >Available pickups</span
                >
              </div>

              <client-only>
                <div
                  class="overflow-x-auto inline-block w-full shadow rounded-lg"
                >
                  <Paginator
                    :maxVisibleButtons="3"
                    :currentPage="current_page"
                    :totalPages="Math.ceil(pickupData.length / limit)"
                    :total="pickupData.length"
                    @pageChanged="refetchPickups"
                  />
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          S/N
                        </th>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Title
                        </th>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Active
                        </th>
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        />
                        <th
                          class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(pickup, index) in pickups" :key="index">
                        <td
                          class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                          :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                        >
                          {{
                            current_page === 1
                              ? index + 1
                              : limit * (current_page - 1) + index + 1
                          }}.
                        </td>
                        <td
                          class="px-1 py-1 font-ubuntu border-b border-gray-200 bg-white text-sm"
                          :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                        >
                          {{ pickup.name }}
                        </td>
                        <td
                          class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                          :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                        >
                          {{ pickup.title }}
                        </td>
                        <td
                          class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                          :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                        >
                          {{ pickup.description }}
                        </td>
                        <td
                          class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                          :class="index % 2 === 0 ? '' : 'bg-gray-100'"
                        >
                          <button
                            v-if="pickup.is_active"
                            disabled
                            class="rounded-full cursor-text text-green-500 py-1 px-2 border border-green-500 bg-transparent text-sm leading-5 font-medium"
                          >
                            active
                          </button>
                          <button
                            v-else
                            disabled
                            class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent bg-gray-200 text-sm leading-5 font-medium"
                          >
                            inactive
                          </button>
                        </td>
                        <td
                          class="py-1 px-1 border-b border-gray-200 bg-white text-sm"
                        >
                          <div class="flex flex-row">
                            <button
                              class="py-2 px-4 mr-1 border border-transparent text-sm leading-5 font-medium rounded text-green-500 bg-green-100 hover:border-green-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                              @click="openModal(pickup.pickup_id)"
                            >
                              <font-awesome-icon :icon="['fa', 'edit']" />
                            </button>
                            <button
                              class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-red-500 bg-red-100 hover:border-red-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                              @click="deletePickup(pickup.pickup_id)"
                            >
                              <font-awesome-icon :icon="['fa', 'trash']" />
                            </button>
                          </div>
                        </td>
                        <td
                          class="py-1 px-1 border-b border-gray-200 bg-white text-sm"
                        >
                          <div class="flex flex-row">
                            <button
                              class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-gray-700 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                              @click="toggleDropDown(pickup.pickup_id)"
                            >
                              <font-awesome-icon :icon="['fa', 'ellipsis-v']" />
                            </button>
                          </div>
                          <div
                            :class="
                              dropDownStateId == pickup.pickup_id
                                ? 'block'
                                : 'hidden'
                            "
                          >
                            <button
                              type="button"
                              class="hidden sm:block sm:fixed sm:opacity-0 sm:inset-0 sm:w-full sm:h-full sm:cursor-default"
                              @click="toggleDropDown(pickup.pickup_id)"
                            />
                            <div
                              class="z-50 sm:mt-2 sm:absolute sm:bg-white sm:rounded sm:right-0 sm:shadow-xl sm:w-48 sm:py-2"
                            >
                              <span
                                class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                                @click="moveItemTo('top', pickup.pickup_id)"
                              >
                                Move to top
                              </span>
                              <span
                                class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                                @click="moveItemTo('bottom', pickup.pickup_id)"
                              >
                                Move to bottom
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Modal -->
                  <b-modal
                    :active.sync="makeModal"
                    has-modal-card
                    trap-focus
                    :destroy-on-hide="false"
                    aria-role="dialog"
                    aria-modal
                  >
                    <pickup-edit-form :pickup="pickupObj" :products="products"  @updateLocalStorage="updateLocalStorage" />
                  </b-modal>
                </div>
              </client-only>
              <div class="w-full">
                <button
                  class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="toggleState"
                >
                  <span class="text-base font-bold mr-2">+</span>
                  <span>Add new pickup</span>
                </button>
              </div>
            </div>
          </div>
          <pickup-form
            :class="showPickupForm ? 'block' : 'hidden'"
            :storeId="store.store_id"
            @ontoggle="toggleState"
            @updateLocalStorage="updateLocalStorage"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Sidenav from "../../components/sidenav";
import Paginator from "../../components/pagination";
import PickupForm from "../../components/Onboarding/Pickups/PickupForm.vue";
import PickupEditForm from "../../components/Onboarding/Pickups/PickupEditForm.vue";
import { FETCH_STORE_PRODUCTS, GET_STORE_PRODUCTS } from "@/store/types";
export default {
  layout: "none",
  components: {
    Sidenav,
    Paginator,
    PickupForm,
    PickupEditForm,
  },
  data() {
    return {
      dropDownStateId: "",
      incomplete: false,
      showPickupForm: false,
      makeModal: false,
      current_page: 1,
      limit: 10,
      product_id: "",
      pickupData: [],
      pickupObj: {},
      newList: [],
    };
  },

  computed: {
    ...mapState(["token", "store", "pickups"]),
    ...mapGetters("modules/storeProducts", {
      products: `${GET_STORE_PRODUCTS}`,
    }),
  },

  async mounted() {
    const data = await this.$axios.get(
      `/stores/pickups/${this.store.store_id}`,
      {
        headers: {
          "x-access-token": this.token,
        },
      }
    );
    this.pickupData = data.data.pickups;
    await this.$store.dispatch(
      `modules/storeProducts/${FETCH_STORE_PRODUCTS}`,
      this.store.store_id
    );
    await this.$axios
      .get(
        `/onboarding/stores/${this.store.store_id}/pickups?limit=${this.limit}&offset=0`,
        {
          headers: {
            "x-access-token": this.token,
          },
        }
      )
      .then((pickups) => {
        this.$store.commit("setPickups", pickups.data.pickups);
      })
      .catch(() => {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: "fade",
          message: "There's an error fetching pickups at this time.",
          position: "is-bottom-right",
          type: "is-primary",
        });
      });
  },

  methods: {
    toggleDropDown(id) {
      this.dropDownStateId === ""
        ? (this.dropDownStateId = id)
        : (this.dropDownStateId = "");
    },
    getCurrentTopAndBottomItem() {
      const len = this.pickups.length;
      const top = this.pickups[len - len].ui_order;
      const bottom = this.pickups[len - 1].ui_order;
      return { top, bottom };
    },

    async moveItemTo(position, pickup_id) {
      try {
        const { top, bottom } = this.getCurrentTopAndBottomItem();
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/pickups/${pickup_id}`,
          { ui_order: position == "top" ? top + 1 : bottom - 1 },
          {
            headers: {
              "x-access-token": this.token,
            },
          }
        );

        // update localStorage after updating item
        this.updateLocalStorage();
        this.dropDownStateId = "";
      } catch (error) {
        console.error(error);
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: "fade",
          message: "Error: unable to move item.",
          position: "is-bottom-right",
          type: "is-primary",
        });
      }
    },

    async updateLocalStorage() {
      const pickups = await this.$axios.get(
        `/onboarding/stores/${this.store.store_id}/pickups?limit=${
          this.limit
        }&offset=${(this.current_page - 1) * this.limit}`,
        {
          headers: {
            "x-access-token": this.token,
          },
        }
      );
      this.$store.commit("setPickups", pickups.data.pickups);
    },

    toggleState() {
      this.showPickupForm = !this.showPickupForm;
    },
    async openModal(pickup_id) {
      const { data: { pickup } } = await this.$axios.get(`/shop/pickups/${pickup_id}`, {
        headers: {
          "x-access-token": this.token,
        },
      });
      this.makeModal = true;
      this.pickupObj = { ...pickup };
    },

    async deletePickup(pickup_id) {
      try {
        // delete single record from database
        await this.$axios.delete(
          `/onboarding/stores/${this.store.store_id}/pickup/${pickup_id}`,
          {
            headers: {
              "x-access-token": this.token,
            },
          }
        );

        // update localStorage after deleting item
        this.updateLocalStorage();
      } catch {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: "fade",
          message: "unable to delete product.",
          position: "is-bottom-right",
          type: "is-primary",
        });
      }
    },

    async refetchPickups(page) {
      await this.$axios
        .get(
          `/onboarding/stores/${this.store.store_id}/pickups?limit=${
            this.limit
          }&offset=${(page - 1) * this.limit}`,
          {
            headers: {
              "x-access-token": this.token,
            },
          }
        )
        .then((pickups) => {
          this.current_page = page;
          this.$store.commit("setPickups", pickups.data.pickups);
        })
        .catch(() => {
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: "fade",
            message: "There's an error fetching pickups at this time.",
            position: "is-bottom-right",
            type: "is-primary",
          });
        });
    },
  },
};
</script>

<style>
input:checked + svg {
  display: block;
}
</style>
