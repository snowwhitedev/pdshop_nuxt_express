<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0">
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="pt-2 pb-6 md:py-6">
          <div class="flex flex-col col-gap-4" :class="showAddonsForm ? 'hidden' : 'block'">
            <div class="w-full mt-5 p-8">
              <div class="w-full border border-t-0 border-l-0 border-r-0">
                <span
                  class="w-full flex flex-col items-center text-gray-800 font-semibold text-2xl mb-3"
                >Available addons</span>
              </div>

              <div class="overflow-x-auto inline-block w-full shadow rounded-lg">
                <Paginator
                  :maxVisibleButtons="3"
                  :currentPage="current_page"
                  :totalPages="Math.ceil(addonsData.length/limit)"
                  :total="addonsData.length"
                  @pageChanged="refetchAddons"
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
                    <tr v-for="(addon, index) in addons" :key="index">
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ current_page === 1 ? index+1 : (limit*(current_page-1))+index+1 }}.
                      </td>
                      <td
                        class="px-1 py-1 font-ubuntu border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ addon.name }}
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ addon.title }}
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ addon.description }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        <button v-if="addon.is_active" disabled class="rounded-full cursor-text text-green-500 py-1 px-2 border border-green-500 bg-transparent text-sm leading-5 font-medium">
                          active
                        </button>
                        <button v-else disabled class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent bg-gray-200 text-sm leading-5 font-medium">
                          inactive
                        </button>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 mr-1 border border-transparent text-sm leading-5 font-medium rounded text-green-500 bg-green-100 hover:border-green-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="openModal(addon)"
                          >
                            <font-awesome-icon :icon="['fa', 'edit']" />
                          </button>
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-red-500 bg-red-100 hover:border-red-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="deactivateAddon(addon.addons_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'trash']" />
                          </button>
                        </div>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-gray-700 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="toggleDropDown(addon.addons_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'ellipsis-v']" />
                          </button>
                        </div>
                        <div :class="dropDownStateId === addon.addons_id ? 'block' : 'hidden'">
                          <button
                            type="button"
                            class="hidden sm:block sm:fixed sm:opacity-0 sm:inset-0 sm:w-full sm:h-full sm:cursor-default"
                            @click="toggleDropDown(addon.addons_id)"
                          />
                          <div
                            class="z-50 sm:mt-2 sm:absolute sm:bg-white sm:rounded sm:right-0 sm:shadow-xl sm:w-48 sm:py-2"
                          >
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('top', addon.addons_id)"
                            >
                              Move to top
                            </span>
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('bottom', addon.addons_id)"
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
                  <div>
                    <div
                      class="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 modal-card"
                    >
                      <div class="max-w-md w-full modal-card-body bg-gray-100">
                        <div>
                          <h2
                            class="mt-3 text-center text-3xl leading-9 font-extrabold text-gray-900"
                          >
                            Edit Addon ({{ addonsObj.name }})
                          </h2>
                        </div>
                        <form class="mt-8" action="#" method="POST">
                          <input type="hidden" name="remember" value="true">
                          <div class="rounded-md shadow-sm">
                            <div class="grid grid-cols-6 w-full">
                              <div v-if="editForm.is_active === false" class="col-span-6 w-full">
                                <button
                                  class="group relative w-32 float-right flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                                  @click.prevent="activateAddon"
                                >
                                  <span>Activate</span>
                                </button>
                              </div>
                              <div class="col-span-6 w-full">
                                <b-tooltip
                                  label="Name of addon (internal use)"
                                  class="w-full"
                                  type="is-info"
                                  position="is-bottom"
                                >
                                  <input
                                    id="addon-name"
                                    v-model="editForm.name"
                                    placeholder="Addon name"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
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
                                    id="addon-title"
                                    v-model="editForm.title"
                                    placeholder="Addon title"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
                                </b-tooltip>
                              </div>
                              <div class="col-span-6 w-full">
                                <b-tooltip
                                  label="Describe the addon"
                                  class="w-full"
                                  type="is-info"
                                  position="is-bottom"
                                >
                                  <textarea
                                    id="addon-description"
                                    v-model="editForm.description"
                                    placeholder="Addon description"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  />
                                </b-tooltip>
                              </div>
                              <div class="col-span-6 w-full">
                                <b-tooltip
                                  label="Addon price"
                                  class="w-full"
                                  type="is-info"
                                  position="is-bottom"
                                >
                                  <input
                                    id="price"
                                    v-model="editForm.price"
                                    placeholder="price"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
                                </b-tooltip>
                              </div>
                              <div class="col-span-6 mt-6 mb-2">
                                <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                                  <span
                                    class="text-xs text-red-700 font-semibold font-ubuntu"
                                  >{{ errorMessage }}</span>
                                </div>
                                <div v-if="success" class="w-full bg-blue-100 p-2 rounded mb-2">
                                  <span class="text-xs text-blue-500 font-semibold font-ubuntu">{{ message }}</span>
                                </div>
                                <button
                                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                                  @click.prevent="editAddon(addonsObj.addons_id)"
                                >
                                  <span v-if="isLoading">Updating...</span>
                                  <span v-else>Update addon</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </b-modal>
              </div>
              <div class="w-full">
                <button
                  class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="toggleState"
                >
                  <span class="text-base font-bold mr-2">+</span>
                  <span>Create addons</span>
                </button>
              </div>
            </div>
          </div>
          <div
            class="w-full flex flex-col items-center"
            :class="showAddonsForm ? 'block' : 'hidden'"
          >
            <div class="w-full ml-2 md:absolute md:top-0 md:mt-2">
              <button
                class="py-2 px-4 float-left border border-transparent text-xl leading-5 font-semibold text-gray-700 focus:outline-none transition duration-150 ease-in-out"
                @click="toggleState"
              >
                <span class>
                  <font-awesome-icon :icon="['fa', 'arrow-left']" />
                </span>
              </button>
            </div>
            <div class="lg:w-3/4 md:w-3/4 lg:p-40 w-full p-5 lg:pt-5">
              <p class="flex flex-row row-gap-3 text-xl font-semibold mb-3">
                <img src="/plus.svg" alt class="h-6 w-6 mt-1 mr-2"> Create addons
              </p>

              <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
                <div class="grid grid-cols-6 w-full">
                  <div class="col-span-6 w-full">
                    <b-tooltip
                      label="Name of addon (internal use)"
                      class="w-full"
                      type="is-info"
                      position="is-left"
                    >
                      <input
                        id="addon-name"
                        v-model="form.name"
                        placeholder="Addon name"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
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
                        id="addon-title"
                        v-model="form.title"
                        placeholder="Addon title"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                    </b-tooltip>
                  </div>
                  <div class="col-span-6 w-full">
                    <b-tooltip
                      label="Describe the addon"
                      class="w-full"
                      type="is-info"
                      position="is-left"
                    >
                      <textarea
                        id="addon-description"
                        v-model="form.description"
                        placeholder="Addon description"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </b-tooltip>
                  </div>
                  <div class="col-span-6 w-full">
                    <b-tooltip
                      label="Addon price"
                      class="w-full"
                      type="is-info"
                      position="is-left"
                    >
                      <input
                        id="price"
                        v-model="form.price"
                        placeholder="Price of addon"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                    </b-tooltip>
                  </div>
                  <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
                    <div v-if="error" class="col-span-6 w-full bg-red-200 p-2 rounded m-2">
                      <span
                        class="text-xs text-red-700 font-semibold font-ubuntu"
                      >{{ errorMessage }}</span>
                    </div>
                    <div class="col-span-6 w-full py-3">
                      <button
                        :disabled="incomplete"
                        class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                        @click="createAddon"
                      >
                        <span v-if="isLoading">Adding...</span>
                        <span v-else>Create addon</span>
                      </button>
                    </div>
                  </div>
                </div>
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
import Sidenav from '../../components/sidenav';
import Paginator from '../../components/pagination';
export default {
  layout: 'none',
  components: {
    Sidenav,
    Paginator
  },
  data () {
    return {
      dropDownStateId: '',
      isLoading: false,
      incomplete: false,
      showAddonsForm: false,
      makeModal: false,
      current_page: 1,
      limit: 50,
      products: {},
      form: {
        name: '',
        title: '',
        description: '',
        price: '',
        store_id: '',
        product_ids: []
      },
      editForm: {
        name: '',
        title: '',
        description: '',
        price: '',
        store_id: '',
        product_ids: [],
        is_active: null,
        updated_at: ''
      },
      addonsData: [],
      addonsObj: {},
      error: false,
      errorMessage: '',
      success: false,
      message: ''
    };
  },

  computed: {
    ...mapState(['token', 'store', 'addons'])
  },

  async created () {
    const data = await this.$axios.get(
      `/stores/${this.store.store_id}/addons`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );

    this.addonsData = data.data.addons;

    const productResponse = await this.$axios.get(
      `/onboarding/stores/${this.store.store_id}/products`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );

    this.products = productResponse.data.products;

    await this.$axios
      .get(
        `/onboarding/stores/${this.store.store_id}/addons?limit=${this.limit}&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      )
      .then((addons) => {
        this.$store.commit('setAddons', addons.data.addons);
      })
      .catch(() => {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: "There's an error fetching addons at this time.",
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      });
    this.form.store_id = this.store.store_id;
  },

  methods: {
    toggleState () {
      this.showAddonsForm = !this.showAddonsForm;
    },

    toggleDropDown (id) {
      this.dropDownStateId === '' ? this.dropDownStateId = id : this.dropDownStateId = '';
    },

    getCurrentTopAndBottomItem () {
      const len = this.addons.length;
      const top = this.addons[len - len].ui_order;
      const bottom = this.addons[len - 1].ui_order;

      return { top, bottom };
    },

    async moveItemTo (position, addon_id) {
      try {
        const { top, bottom } = this.getCurrentTopAndBottomItem();
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/addons/${addon_id}`,
          { ui_order: position == 'top' ? top + 1 : bottom - 1 },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after updating item
        this.updateLocalStorage();
        this.dropDownStateId = '';
      } catch (error) {
        console.error(error);
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Error: unable to move item.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    findIndex (id) {
      let item;
      this.dropdownState.forEach((x) => {
        if (x.id === id) {
          item = x;
        }
      });
      return item.status;
    },

    async updateLocalStorage () {
      const addons = await this.$axios.get(
        `/onboarding/stores/${this.store.store_id}/addons?limit=${
          this.limit
        }&offset=${(this.current_page - 1) * this.limit}`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );
      this.$store.commit('setAddons', addons.data.addons);
    },

    validateFormFields () {
      if (this.form.name === '' || this.form.title === '' || this.form.description === '' || this.form.price === '') {
        this.error = true;
        this.errorMessage = 'All form fields are required';
        this.isLoading = false;
        return false;
      }

      return true;
    },

    openModal (addon) {
      this.makeModal = true;
      this.addonsObj = addon;
      this.editForm.name = addon.name;
      this.editForm.description = addon.description;
      this.editForm.title = addon.title;
      this.editForm.store_id = addon.store_id;
      this.editForm.price = addon.price;
      this.editForm.is_active = addon.is_active;
      this.editForm.product_ids = addon.product_ids;
    },

    activateAddon () {
      this.editForm.is_active = !this.editForm.is_active;
      this.success = true;
      this.message = 'Click the update button to effect you changes';
    },

    async editAddon (addon_id) {
      this.isLoading = true;
      const date = new Date();
      try {
        this.editForm.updated_at = date.toISOString();
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/addons/${addon_id}`,
          this.editForm,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after updating item
        this.updateLocalStorage();
        this.makeModal = false;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'unable to update addon.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async deactivateAddon (addons_id) {
      try {
        // deactivate single record from database
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/addons/${addons_id}`, { is_active: false },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after deactivating item
        this.updateLocalStorage();
      } catch {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'unable to delete addon.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async refetchAddons (page) {
      await this.$axios
        .get(
          `/onboarding/stores/${this.store.store_id}/addons?limit=${
            this.limit
          }&offset=${(page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        )
        .then((addons) => {
          this.current_page = page;
          this.$store.commit('setAddons', addons.data.addons);
        })
        .catch(() => {
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: "There's an error fetching addons at this time.",
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        });
    },

    async createAddon () {
      this.isLoading = true;
      const validate = this.validateFormFields();

      if (validate) {
        try {
        // set addon to all products
          this.products.forEach((item) => {
            this.form.product_ids.push(item.product_id);
          });

          await this.$axios.post(
          `/onboarding/stores/${this.store.store_id}/addons`,
          this.form,
          {
            headers: {
              'x-access-token': this.token
            }
          }
          );

          // update localStorage after updating item
          this.updateLocalStorage();

          this.isLoading = false;
          this.error = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Addon created successfully.',
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
          this.form.price = '';
          this.form.is_active = null;
          this.form.product_ids = [];
        }
      }
    }
  }
};
</script>

<style>
input:checked + svg {
  display: block;
}
</style>
