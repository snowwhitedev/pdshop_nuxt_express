<template>
  <div>
    <div class="h-full">
      <!-- Off-canvas menu for mobile -->
      <div class="md:hidden" :class="sidebarState ? 'block' : 'hidden'">
        <div class="fixed inset-0 flex z-40">
          <div class="fixed inset-0">
            <div class="absolute inset-0 bg-gray-600 opacity-75" />
          </div>
          <div class="relative flex-1 flex flex-col max-w-xs w-full bg-gray-100">
            <div class="absolute top-0 right-0 -mr-14 p-1">
              <button
                class="text-gray-500 flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                aria-label="Close sidebar"
                @click="toggleSidebar"
              >
                <svg
                  class="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div class="flex-shrink-0 flex items-center px-4">
                <img class="h-8 w-auto" src="@/assets/logo1.png" alt="logo">
              </div>
              <nav class="mt-5 px-2 border border-r-0 border-l-0 border-b-0 border-gray-400 text-sm">
                <router-link
                  to="/onboarding/dashboard"
                  class="group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
                >
                  <div class="mr-3">
                    <font-awesome-icon :icon="['fa', 'home']" />
                  </div>
                  Dashboard
                </router-link>
                <router-link
                  to="/onboarding/coupons"
                  class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
                >
                  <div class="mr-3">
                    <font-awesome-icon :icon="['fa', 'tags']" />
                  </div>
                  Coupons
                </router-link>
                <router-link
                  to="/onboarding/products"
                  class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
                >
                  <div class="mr-3">
                    <font-awesome-icon :icon="['fa', 'box']" />
                  </div>
                  Products
                </router-link>
                <router-link
                  to="/onboarding/pickups"
                  class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
                >
                  <div class="mr-3">
                    <font-awesome-icon :icon="['fa', 'map-marker-alt']" />
                  </div>
                  Pickups
                </router-link>
                <router-link
                  to="/onboarding/settings"
                  class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
                >
                  <div class="mr-3">
                    <font-awesome-icon :icon="['fa', 'cog']" />
                  </div>
                  Settings
                </router-link>
              </nav>
            </div>
            <div class="flex-shrink-0 flex flex-col bg-red-900 p-4">
              <a href="#" class="flex-shrink-0 group block">
                <div class="flex items-center">
                  <div>
                    <client-only>
                      <img
                        class="inline-block h-10 w-10 rounded-full"
                        :src="logo"
                        alt
                      >
                    </client-only>
                  </div>
                  <div class="ml-3">
                    <p class="text-base leading-6 font-medium text-white">{{ user.first_name }} {{ user.last_name }}</p>
                    <p
                      class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150"
                    >View profile</p>
                  </div>
                </div>
              </a>
              <div class="flex items-center text-sm">
                <a
                  class="flex-shrink-0 w-full group block text-white hover:text-white"
                  @click="logout"
                >
                  <span class="mr-3">
                    <font-awesome-icon :icon="['fa', 'sign-out-alt']" />
                  </span>
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 w-14">
          <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </div>

      <!-- Static sidebar for desktop -->
      <div class="hidden md:flex md:flex-shrink-0 h-full">
        <div class="flex flex-col w-64 bg-white">
          <div class="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div class="flex items-center flex-shrink-0 px-4">
              <img class="h-8 w-auto" src="@/assets/logo1.png" alt="logo">
            </div>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <nav class="mt-5 flex-1 px-2 py-3 bg-white border-2 border-gray-400 border-r-0 border-l-0 border-b-0 text-sm">
              <router-link
                to="/onboarding/dashboard"
                class="group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'home']" />
                </div>
                Dashboard
              </router-link>
              <router-link
                to="/onboarding/coupons"
                class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'tags']" />
                </div>
                Coupons
              </router-link>
              <router-link
                to="/onboarding/products"
                class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'box']" />
                </div>
                Products
              </router-link>
              <router-link
                to="/onboarding/pickups"
                class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'map-marker-alt']" />
                </div>
                Pickups
              </router-link>
              <router-link
                to="/onboarding/addons"
                class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'cart-plus']" />
                </div>
                Add-ons
              </router-link>
              <router-link
                to="/onboarding/settings"
                class="mt-1 group flex items-center px-2 py-2 leading-5 font-medium text-gray-800 rounded-md hover:text-white hover:bg-red-700 focus:outline-none focus:text-white focus:bg-gray-800 transition ease-in-out duration-150"
              >
                <div class="mr-3">
                  <font-awesome-icon :icon="['fa', 'cog']" />
                </div>
                Settings
              </router-link>
            </nav>
          </div>
          <div class="flex-shrink-0 flex flex-col bg-red-900 p-4">
            <a href="#" class="flex-shrink-0 w-full group block">
              <div class="flex items-center">
                <div>
                  <client-only>
                    <img
                      class="inline-block h-10 w-10 rounded-full"
                      :src="logo"
                      alt
                    >
                  </client-only>
                </div>
                <div class="ml-3">
                  <p
                    class="text-sm leading-5 font-medium text-white"
                  >{{ user.first_name }} {{ user.last_name }}</p>
                  <p
                    class="text-xs leading-4 font-medium text-white transition ease-in-out duration-150"
                  >View profile</p>
                </div>
              </div>
            </a>
            <div class="absolute right-0 top-0 flex items-center mr-2 text-sm">
              <a
                class="flex-shrink-0 w-full group block text-gray-800 hover:text-gray-700 z-10"
                @click="logout"
              >
                <span class="mr-2">
                  <font-awesome-icon :icon="['fa', 'sign-out-alt']" />
                </span>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:hidden flex flex-row absolute left-0 top-0 z-10">
      <button
        class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
        aria-label="Open sidebar"
        @click="toggleSidebar"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div class="flex-shrink-0 flex items-center px-4">
        <img class="h-8 w-auto" src="@/assets/logo1.png" alt="logo">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      sidebarState: false,
      makeModal: false
    };
  },
  computed: {
    ...mapState(['user', 'loggedIn', 'store', 'token']),
    logo: (vm) => {
      return vm.store.logo;
    }
  },

  created () {
    if (!this.loggedIn) {
      this.$router.replace('/onboarding');
    }
  },

  methods: {
    toggleSidebar () {
      this.sidebarState = !this.sidebarState;
    },

    openModal () {
      this.makeModal = true;
    },

    logout () {
      this.$store.commit('setLogout');
      this.$router.push('/onboarding');
    }
  },
  head () {
    return {
      title: `Per Diem | ${this.store.name}`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.store ? this.store.description : ''
        }
      ]
    };
  }
};
</script>
