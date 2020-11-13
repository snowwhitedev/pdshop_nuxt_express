<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0">
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="pt-2 pb-6 md:py-6">
          <div class="flex flex-col col-gap-4">
            <div class="w-full mt-5 p-8">
              <div class="w-full border border-t-0 border-l-0 border-r-0">
                <span
                  class="w-full flex flex-col items-center text-gray-800 font-semibold text-2xl mb-3"
                >Coupons</span>
              </div>

              <div class="inline-block w-full shadow rounded-lg overflow-x-auto">
                <Paginator
                  :maxVisibleButtons="3"
                  :currentPage="current_page"
                  :totalPages="Math.ceil(couponsData.length/limit)"
                  :total="couponsData.length"
                  @pageChanged="refetchCoupons"
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
                        Code
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        type
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(coupon, index) in coupons" :key="index">
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm text-center"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ current_page === 1 ? index+1 : (limit*(current_page-1))+index+1 }}.
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ coupon.name }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ coupon.code }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ coupon.amount }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        <button
                          v-if="coupon.isPercent"
                          disabled
                          class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent text-sm leading-5 font-medium"
                        >
                          percent
                        </button>
                        <button
                          v-else
                          disabled
                          class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent text-sm leading-5 font-medium"
                        >
                          amount
                        </button>
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        <button
                          v-if="!coupon.is_active"
                          disabled
                          class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent bg-gray-200 text-sm leading-5 font-medium"
                        >
                          inactive
                        </button>
                        <button
                          v-else
                          disabled
                          class="rounded-full cursor-text text-green-500 py-1 px-2 border border-green-500 bg-transparent text-sm leading-5 font-medium"
                        >
                          active
                        </button>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 mr-1 border border-transparent text-sm leading-5 font-medium rounded text-green-500 bg-green-100 hover:border-green-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="openModal(coupon)"
                          >
                            <font-awesome-icon :icon="['fa', 'edit']" />
                          </button>
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-red-500 bg-red-100 hover:border-red-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="deleteCoupon(coupon.coupon_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'trash']" />
                          </button>
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
                            Edit Coupon
                          </h2>
                        </div>
                        <form class="mt-8" action="#" method="POST">
                          <input type="hidden" name="remember" value="true">
                          <div class="rounded-md shadow-sm">
                            <div class="rounded bg-gray-100 shadow-md p-2">
                              <div class="flex flex-row justify-between">
                                <div class="text-sm font-semibold">
                                  <span>Use percentage</span>
                                </div>
                                <div>
                                  <ToggleButton
                                    v-model="editForm.isPercent"
                                    :index="1"
                                    onText="Disable"
                                    offText="Enable"
                                    @state-change="updateType()"
                                  />
                                </div>
                              </div>

                              <div class="flex flex-row justify-between mt-1">
                                <div class="text-sm font-semibold">
                                  <span>Coupon status</span>
                                </div>
                                <div>
                                  <ToggleButton
                                    v-model="editForm.is_active"
                                    :index="2"
                                    onText="Active"
                                    offText="Inactive"
                                    @state-change="updateStatus()"
                                  />
                                </div>
                              </div>

                              <div class="flex flex-row justify-between mt-1">
                                <div class="text-sm font-semibold">
                                  <span>Coupon code</span>
                                </div>
                                <div>
                                  <input
                                    v-model="editForm.code"
                                    type="text"
                                    class="w-32 form-input block py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
                                </div>
                              </div>

                              <div class="flex flex-row justify-between mt-1">
                                <div class="text-sm font-semibold">
                                  <span>Coupon amount</span>
                                </div>
                                <div>
                                  <input
                                    v-model="editForm.amount"
                                    type="text"
                                    class="w-32 form-input block py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
                                </div>
                              </div>
                            </div>

                            <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                              <span
                                class="text-xs text-red-700 font-semibold font-ubuntu"
                              >{{ errorMessage }}</span>
                            </div>
                            <div class="mt-6">
                              <button
                                :disabled="isLoading"
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-600 transition duration-150 ease-in-out"
                                @click.prevent="editCoupon(id)"
                              >
                                <span v-if="isLoading">Updating...</span>
                                <span v-else>Update coupon</span>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </b-modal>
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
import Sidenav from '@/components/sidenav';
import Paginator from '@/components/pagination';
import ToggleButton from '@/components/toggleButton';
export default {
  layout: 'none',
  components: {
    Sidenav,
    Paginator,
    ToggleButton
  },
  data () {
    return {
      isLoading: false,
      makeModal: false,
      current_page: 1,
      limit: 50,
      couponsData: [],
      error: false,
      errorMessage: '',
      id: '',
      editForm: {
        isPercent: null,
        is_active: null,
        amount: '',
        code: '',
        updated_at: ''
      }
    };
  },

  computed: {
    ...mapState(['token', 'store', 'coupons'])
  },

  async created () {
    // fetch all records from database for pagination component
    const data = await this.$axios.get(
      `/stores/coupons/${this.store.store_id}`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );
    this.couponsData = data.data.coupons;

    // fetch partial records from database
    await this.$axios
      .get(
        `/onboarding/stores/${this.store.store_id}/coupons?limit=${this.limit}&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      )
      .then((coupons) => {
        this.$store.commit('setCoupons', coupons.data.coupons);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    async refetchCoupons (page) {
      await this.$axios
        .get(
          `/onboarding/stores/${this.store.store_id}/coupons?limit=${
            this.limit
          }&offset=${(page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        )
        .then((coupons) => {
          this.current_page = page;
          this.$store.commit('setCoupons', coupons.data.coupons);
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

    openModal (coupon) {
      this.makeModal = true;
      this.editForm.isPercent = coupon.isPercent;
      this.editForm.is_active = coupon.is_active;
      this.editForm.amount = coupon.amount;
      this.editForm.code = coupon.code;
      this.id = coupon.coupon_id;
    },

    updateType () {
      this.editForm.isPercent = !this.editForm.isPercent;
    },

    updateStatus () {
      this.editForm.is_active = !this.editForm.is_active;
    },

    async editCoupon (id) {
      this.isLoading = true;
      const date = new Date();
      try {
        this.editForm.updated_at = date.toISOString();
        if (this.editForm.isPercent === true && parseInt(this.editForm.amount) > 100) {
          this.error = true;
          this.errorMessage = 'Amount cannot be greater than 100 when setting amount in percentage.';
          this.isLoading = false;
          return this.errorMessage;
        }

        await this.$axios.put(
          `/onboarding/stores/${this.store.store_id}/coupons/${id}`,
          {
            payload: { id: this.id, updateFields: this.editForm }
          },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        const coupons = await this.$axios.get(
          `/onboarding/stores/${this.store.store_id}/coupons?limit=${
            this.limit
          }&offset=${(this.current_page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );
        this.$store.commit('setCoupons', coupons.data.coupons);
        this.isLoading = false;
        this.makeModal = false;
      } catch (error) {
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async deleteCoupon (id) {
      try {
        await this.$axios.delete(`/onboarding/stores/${this.store.store_id}/coupons/${id}`, {
          headers: {
            'x-access-token': this.token
          }
        });

        const coupons = await this.$axios.get(
          `/onboarding/stores/${this.store.store_id}/coupons?limit=${
            this.limit
          }&offset=${(this.current_page - 1) * 10}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );
        this.$store.commit('setCoupons', coupons.data.coupons);
      } catch (error) {
        return this.$buefy.notification.open({
          duration: 3000,
          closable: false,
          animation: 'fade',
          message: 'An unexpected error occurred.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    }
  }
};
</script>
