<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0">
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="pt-2 pb-6 md:py-6">
          <div class="flex flex-col col-gap-4" :class="showProductForm ? 'hidden' : 'block'">
            <div class="w-full mt-5 p-8">
              <div class="w-full border border-t-0 border-l-0 border-r-0">
                <span
                  class="w-full flex flex-col items-center text-gray-800 font-semibold text-2xl mb-3"
                >List of products</span>
              </div>

              <div class="inline-block w-full shadow rounded-lg overflow-x-auto">
                <Paginator
                  :maxVisibleButtons="3"
                  :currentPage="current_page"
                  :totalPages="Math.ceil(productData.length/limit)"
                  :total="productData.length"
                  @pageChanged="refetchProducts"
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
                    <tr v-for="(product, index) in products" :key="index">
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ current_page === 1 ? index+1 : (limit*(current_page-1))+index+1 }}.
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ product.name }}
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ product.title }}
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ product.description }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        <button v-if="product.is_active" disabled class="rounded-full cursor-text text-green-500 py-1 px-2 border border-green-500 bg-transparent text-sm leading-5 font-medium">
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
                            @click="openModal(product)"
                          >
                            <font-awesome-icon :icon="['fa', 'edit']" />
                          </button>
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-red-500 bg-red-100 hover:border-red-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="deleteProduct(product.product_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'trash']" />
                          </button>
                        </div>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-gray-700 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="toggleDropDown(product.product_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'ellipsis-v']" />
                          </button>
                        </div>
                        <div :class="dropDownStateId === product.product_id ? 'block' : 'hidden'">
                          <button
                            type="button"
                            class="hidden sm:block sm:fixed sm:opacity-0 sm:inset-0 sm:w-full sm:h-full sm:cursor-default"
                            @click="toggleDropDown(product.product_id)"
                          />
                          <div
                            class="z-50 sm:mt-2 sm:absolute sm:bg-white sm:rounded sm:right-0 sm:shadow-xl sm:w-48 sm:py-2"
                          >
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('top', product.product_id)"
                            >
                              Move to top
                            </span>
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('bottom', product.product_id)"
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
                            Edit product ({{ prod.name }})
                          </h2>
                        </div>
                        <form class="mt-8" action="#" method="POST">
                          <input type="hidden" name="remember" value="true">
                          <div class="rounded-md shadow-sm">
                            <div class>
                              <b-tooltip
                                label="Name of product (internal use)"
                                class="w-full"
                                type="is-info"
                                position="is-bottom"
                              >
                                <input
                                  id="product-name"
                                  v-model="editForm.name"
                                  placeholder="Product name"
                                  class="form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                >
                              </b-tooltip>
                            </div>
                            <div class>
                              <b-tooltip
                                label="The name displayed to your customers"
                                class="w-full"
                                type="is-info"
                                position="is-bottom"
                              >
                                <input
                                  id="product-name"
                                  v-model="editForm.title"
                                  placeholder="Product title"
                                  class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                >
                              </b-tooltip>
                            </div>
                            <div class>
                              <b-tooltip
                                label="Give your customers an overview"
                                class="w-full"
                                type="is-info"
                                position="is-bottom"
                              >
                                <textarea
                                  id
                                  v-model="editForm.description"
                                  placeholder="Describe your product"
                                  cols="30"
                                  rows="5"
                                  class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                              </b-tooltip>
                            </div>

                            <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                              <span
                                class="text-xs text-red-700 font-semibold font-ubuntu"
                              >{{ errorMessage }}</span>
                            </div>
                            <div class="mt-6">
                              <button
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                                @click.prevent="editProduct(prod.product_id)"
                              >
                                <span v-if="isLoading">Updating...</span>
                                <span v-else>Update product</span>
                              </button>
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
                  class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="toggleState"
                >
                  <span class="text-base font-bold mr-2">+</span>
                  <span>Add new product</span>
                </button>
              </div>
            </div>
          </div>
          <div
            class="w-full flex flex-col items-center"
            :class="showProductForm ? 'block' : 'hidden'"
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
            <div class="lg:w-2/3 lg:p-40 p-5 lg:pt-5">
              <p class="flex flex-row row-gap-3 text-xl font-semibold mb-3">
                <img src="/plus.svg" alt class="h-6 w-6 mt-1 mr-2"> Add product
              </p>
              <div class>
                <b-tooltip
                  label="Name of product (internal use)"
                  class="w-full"
                  type="is-info"
                  position="is-left"
                >
                  <input
                    id="product-name"
                    v-model="form.name"
                    placeholder="Product name"
                    class="form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  >
                </b-tooltip>
              </div>
              <div class>
                <b-tooltip
                  label="The name displayed to your customers"
                  class="w-full"
                  type="is-info"
                  position="is-left"
                >
                  <input
                    id="product-name"
                    v-model="form.title"
                    placeholder="Product title"
                    class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  >
                </b-tooltip>
              </div>
              <div class>
                <b-tooltip
                  label="Give your customers an overview"
                  class="w-full"
                  type="is-info"
                  position="is-left"
                >
                  <textarea
                    id
                    v-model="form.description"
                    placeholder="Describe your product"
                    cols="30"
                    rows="5"
                    class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </b-tooltip>
              </div>

              <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
                <span class="text-gray-900 font-semibold text-base">Set pricing</span>
                <div>
                  <div class="relative flex flex-row items-center mt-1">
                    <select
                      v-model="interval"
                      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option disabled value>
                        Select interval
                      </option>
                      <option>week</option>
                      <option>month</option>
                      <option>year</option>
                    </select>
                    <div class="absolute top-0 mt-3 right-0 px-2 text-gray-700">
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <b-tooltip
                    label="Product price"
                    class="w-32 mx-1"
                    type="is-info"
                    position="is-left"
                  >
                    <input
                      id="price"
                      v-model="price"
                      pattern="[0-9]"
                      placeholder="$0.00"
                      :disabled="form.prices.length === 3 ? true : false"
                      class="form-input w-32 py-2 px-3 border border-gray-400 rounded-md shadow-sm disabled:cursor-not-allowed focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    >
                  </b-tooltip>
                  <button
                    :disabled="form.prices.length === 3 ? true : false"
                    class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                    @click="addPrice"
                  >
                    <span class="text-base font-bold mr-2">+</span>
                    <span>Add new price</span>
                  </button>
                  <div v-if="showPrices">
                    <div
                      v-for="(item, index) in form.prices"
                      :key="index"
                      class="flex flex-row justify-between w-full text-gray-800 font-semibold text-sm"
                    >
                      <span>price:</span>
                      <span>{{ item.price }} / {{ item.interval }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                  <span class="text-xs text-red-700 font-semibold font-ubuntu">{{ errorMessage }}</span>
                </div>
                <div v-if="success" class="w-full bg-blue-100 p-2 rounded mt-2">
                  <span class="text-xs text-blue-500 font-semibold font-ubuntu">Click <router-link to="/onboarding/pickups">here</router-link> to add a pickup location for your product</span>
                </div>
                <div class="w-full py-3">
                  <button
                    :disabled="incomplete"
                    class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                    @click="addProduct"
                  >
                    <span v-if="isLoading">Adding product...</span>
                    <span v-else>Add Product</span>
                  </button>
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
import sidenav from '../../components/sidenav';
import Paginator from '../../components/pagination';
export default {
  layout: 'none',
  components: {
    sidenav,
    Paginator
  },
  data () {
    return {
      dropDownStateId: '',
      isLoading: false,
      incomplete: true,
      showProductForm: false,
      makeModal: false,
      current_page: 1,
      limit: 50,
      form: {
        name: '',
        stripe_product_id: '',
        title: '',
        prices: [],
        description: '',
        store_id: '',
        frequency: 'month'
      },
      editForm: {
        name: '',
        stripe_product_id: '',
        title: '',
        description: '',
        store_id: '',
        updated_at: ''
      },
      price_id: '',
      price: '',
      interval: '',
      day_of_week: '',
      productData: [],
      prod: {},
      showPrices: false,
      error: false,
      errorMessage: '',
      success: false
    };
  },

  computed: {
    ...mapState(['token', 'store', 'products'])
  },

  async created () {
    this.form.store_id = this.store.store_id;

    // fetch all records from database for pagination component
    const data = await this.$axios.get(
      `/stores/${this.store.store_id}/products`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );

    this.productData = data.data.products;

    // fetch partial records from database
    await this.$axios
      .get(
        `/onboarding/stores/${this.store.store_id}/products?limit=${this.limit}&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      )
      .then((products) => {
        this.$store.commit('setProducts', products.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    toggleState () {
      this.showProductForm = !this.showProductForm;
    },

    toggleDropDown (id) {
      this.dropDownStateId === '' ? this.dropDownStateId = id : this.dropDownStateId = '';
    },

    getCurrentTopAndBottomItem () {
      const len = this.products.length;
      const top = this.products[len - len].ui_order;
      const bottom = this.products[len - 1].ui_order;

      return { top, bottom };
    },

    async moveItemTo (position, product_id) {
      try {
        const { top, bottom } = this.getCurrentTopAndBottomItem();
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/products/${product_id}`,
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

    async updateLocalStorage () {
      const products = await this.$axios.get(
          `/onboarding/stores/${this.store.store_id}/products?limit=${
            this.limit
          }&offset=${(this.current_page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
      );
      this.$store.commit('setProducts', products.data.products);
    },

    validateFormFields () {
      if (this.form.name === '' || this.form.title === '' || this.form.description === '') {
        this.error = true;
        this.errorMessage = 'All form fields are required';
        this.isLoading = false;
        return false;
      }

      return true;
    },

    openModal (product) {
      this.makeModal = true;
      this.prod = product;
      this.editForm.name = product.name;
      this.editForm.stripe_product_id = product.stripe_product_id;
      this.editForm.description = product.description;
      this.editForm.title = product.title;
      this.editForm.store_id = product.store_id;
    },

    async editProduct (product_id) {
      const date = new Date();
      try {
        this.editForm.updated_at = date.toISOString();
        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/products/${product_id}`,
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
      } catch (error) {
        this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'unable to update product.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async deleteProduct (product_id) {
      try {
        // delete single record from database
        await this.$axios.delete(`/onboarding/stores/${this.store.store_id}/product/${product_id}`, {
          headers: {
            'x-access-token': this.token
          }
        });

        // update localStorage after deleting item
        this.updateLocalStorage();
      } catch {
        this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'unable to delete product.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async refetchProducts (page) {
      await this.$axios
        .get(
          `/onboarding/stores/${this.store.store_id}/products?limit=${
            this.limit
          }&offset=${(page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        )
        .then((products) => {
          this.current_page = page;
          this.$store.commit('setProducts', products.data.products);
        })
        .catch(() => {
          this.$buefy.notification.open({
            duration: 3000,
            closable: false,
            animation: 'fade',
            message: 'unable to fetch data.',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        });
    },

    addPrice () {
      const reg = new RegExp('^\\d+$');
      if (!reg.test(this.price)) {
        this.error = true;
        this.errorMessage = 'price must be numeric value';
        return;
      }

      if (this.interval === '') {
        this.error = true;
        this.errorMessage = 'Interval can not be empty.';
        return;
      }

      for (let i = 0; i < this.form.prices.length; i++) {
        if (this.form.prices[i].interval === this.interval) {
          this.error = true;
          this.errorMessage =
            'Interval already selected, set price for a different interval.';
          return;
        }
      }
      this.error = false;
      const price = {
        price: this.price,
        price_id: this.price_id,
        interval: this.interval
      };
      this.form.prices.push(price);
      this.price = '';
      this.showPrices = true;
      this.incomplete = false;
    },

    async addProduct () {
      this.isLoading = true;
      this.showPrices = false;
      const validate = this.validateFormFields();

      if (validate) {
        if (this.price !== '' && this.interval !== '') {
          const price = {
            price: this.price,
            price_id: this.price_id,
            interval: this.interval
          };
          this.form.prices.push(price);
        }

        this.form.prices = JSON.stringify(this.form.prices);
        // create new product
        await this.$axios
          .post(
          `/onboarding/stores/${this.store.store_id}/products`,
          this.form,
          {
            headers: {
              'x-access-token': this.token
            }
          }
          )
          .then(() => {
            this.error = false;
            this.isLoading = false;
            this.success = true;
            this.$buefy.notification.open({
              duration: 3000,
              closable: false,
              animation: 'fade',
              message: 'Product created successfully.',
              position: 'is-bottom-right',
              type: 'is-success'
            });
          })
          .catch(() => {
            this.isLoading = false;
            this.errorMessage = 'An unexpected error occurred, try again';
            this.error = true;
            this.success = false;
          })
          .finally(() => {
            this.form.name = '';
            this.form.title = '';
            this.form.prices = [];
            this.form.description = '';
            this.selectWeek = true;
            this.selectMonth = true;
            this.selectYear = true;
          });

        // update localStorage after updating item
        this.updateLocalStorage();
      }
    }
  }
};
</script>
