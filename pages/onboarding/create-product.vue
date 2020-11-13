<template>
  <div class="relative bg-gray-100 h-full overflow-hidden">
    <div class="relative pt-6 pb-12 sm:pb-32">
      <Header />
      <main class="h-full lg:p-5 pt-0 ">
        <div class="w-full flex flex-col items-center">
          <div class="lg:w-7/12 lg:p-40 p-5 lg:pt-5">
            <p class="flex flex-row row-gap-3 text-xl font-semibold mb-3">
              <img src="/plus.svg" alt class="h-6 w-6 mt-1 mr-2"> Create your first product
            </p>
            <div class>
              <input
                id="product-name"
                v-model="form.name"
                placeholder="Product name"
                class="form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </div>
            <div class>
              <input
                id="product-name"
                v-model="form.title"
                placeholder="Product title"
                class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
            </div>
            <div class>
              <textarea
                id
                v-model="form.description"
                name
                placeholder="Describe your product"
                cols="30"
                rows="5"
                class="mt-1 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>

            <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
              <span class="text-gray-900 font-semibold text-base">Set pricing/subscription</span>
              <div>
                <div class="relative flex flex-row items-center mt-1">
                  <select v-model="interval" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option disabled value="">
                      Select interval
                    </option>
                    <option>week</option>
                    <option>month</option>
                    <option>year</option>
                  </select>
                  <div class="absolute top-0 mt-3 right-0 px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
                <input
                  id="price"
                  v-model="price"
                  pattern="[0-9]"
                  placeholder="$0.00"
                  :disabled="form.prices.length === 3 ? true : false"
                  class="mx-1 form-input w-32 py-2 px-3 border border-gray-400 rounded-md shadow-sm disabled:cursor-not-allowed focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                <button
                  :disabled="form.prices.length === 3 ? true : false"
                  class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="addPrice"
                >
                  <span class="text-base font-bold mr-2">+</span>
                  <span>Add new price</span>
                </button>
                <div v-if="showPrices">
                  <div v-for="(item, index) in form.prices" :key="index" class="flex flex-row justify-between w-full text-gray-800 font-semibold text-sm">
                    <span>price:</span>
                    <span>{{ item.price }} / {{ item.interval }}</span>
                  </div>
                </div>
              </div>

              <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                <span
                  class="text-xs text-red-700 font-semibold font-ubuntu"
                >{{ errorMessage }}</span>
              </div>
              <div class="w-full py-3">
                <button
                  :disabled="incomplete"
                  class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="addProduct"
                >
                  <span v-if="isLoading">Loading...</span>
                  <span v-else>To dashboard <font-awesome-icon :icon="['fa', 'arrow-right']" /></span>
                </button>
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
import { mapState } from 'vuex';
import Header from '../../components/header';
import Footer from '../../components/footer';
export default {
  layout: 'none',
  components: {
    Header,
    Footer
  },

  data () {
    return {
      isLoading: false,
      incomplete: true,
      form: {
        name: '',
        stripe_product_id: '',
        title: '',
        prices: [],
        description: '',
        store_id: '',
        frequency: 'month'
      },
      price_id: '',
      price: '',
      interval: '',
      showPrices: false,
      error: false,
      errorMessage: ''
    };
  },

  computed: {
    ...mapState(['token', 'store'])
  },

  created () {
    this.form.store_id = this.store.store_id;
  },

  methods: {

    addPrice () {
      const reg = new RegExp('^\\d+$');
      if (!reg.test(this.price)) {
        this.error = true;
        this.errorMessage = 'price must be numeric value';
        return;
      }

      for (let i = 0; i < this.form.prices.length; i++) {
        if (this.form.prices[i].interval === this.interval) {
          this.error = true;
          this.errorMessage = 'Interval already selected, set price for a different interval.';
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
        .post(`/onboarding/stores/${this.store.store_id}/products`, this.form, {
          headers: {
            'x-access-token': this.token
          }
        })
        .then(() => {
          this.error = false;
          this.isLoading = false;
          this.$router.push('/onboarding/dashboard');
        })
        .catch(() => {
          this.isLoading = false;
          this.errorMessage = 'An unexpected error occurred, try again';
          this.error = true;
        })
        .finally(() => {
          this.form.name = '';
          this.form.title = '';
          this.form.prices = JSON.parse(this.form.prices);
          for (let i = 0; i < this.form.prices.length; i++) {
            this.form.prices[i].price = '';
          }
          this.form.description = '';
          this.selectWeek = true;
          this.selectMonth = true;
          this.selectYear = true;
        });
    }
  }
};
</script>
