<template>
  <div>
    <nav class="relative max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6">
      <div class="flex items-center flex-1">
        <div class="flex items-center justify-between w-full md:w-auto">
          <a href="/dashboard" aria-label="Home">
            <img class="h-8 w-auto sm:h-10" src="@/assets/logo1.png" alt="Logo">
          </a>
          <div class="-mr-2 flex items-center md:hidden">
            <button
              id="main-menu"
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition duration-150 ease-in-out"
              aria-label="Main menu"
              aria-haspopup="true"
              @click="showMenu = !showMenu"
            >
              <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="hidden md:flex ">
        <p
          class="inline-flex mr-6 items-center px-4 py-2 text-base leading-5 font-semibold text-gray-800 focus:outline-none transition duration-150 ease-in-out"
        >
          Hello, {{ user.first_name }}
        </p>
        <div class="py-5 px-4 border-t border-red-800 sm:border-t-0 sm:py-0 absolute right-0">
          <div class="hidden items-center sm:flex">
            <!-- <button type="button" class="h-6 w-6 rounded-full hover:bg-indigo-500 text-white focus:outline-none focus:bg-indigo-500 bg-gray-700 p-1 mr-6">
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="19" r="3"/><path d="M10.02 4.28L10 4a2 2 0 1 1 3.98.28A7 7 0 0 1 19 11v5a1 1 0 0 0 1 1 1 1 0 0 1 0 2H4a1 1 0 0 1 0-2 1 1 0 0 0 1-1v-5a7 7 0 0 1 5.02-6.72z"/></svg>
                </button>-->
            <button
              type="button"
              class="h-10 w-10 p-2 rounded-full border-2 border-red-700 text-red-700 hover:border-gray-700 hover:text-gray-700 focus:text-gray-400 focus:outline-none focus:border-gray-400"
              @click="toggleDropdown"
            >
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                <path
                  d="M21 20v-1a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v1c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2z"
                />
              </svg>
              <!-- {@html genUniqueAvatar(auth.user().email) } -->
            </button>
          </div>
          <div :class="dropdownOpen ? 'sm:block' : 'sm:hidden'">
            <button
              type="button"
              class="hidden sm:block sm:fixed sm:opacity-0 sm:inset-0 sm:w-full sm:h-full sm:cursor-default"
              @click="toggleDropdown"
            />
            <div
              class="z-50 sm:mt-3 sm:absolute sm:bg-white sm:rounded sm:right-0 sm:shadow-xl sm:w-48 sm:py-2"
            >
              <a
                href="#"
                class="py-3 block text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                @click="logout()"
              >Log out</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!--
      Entering: "duration-150 ease-out"
        From: "opacity-0 scale-95"
        To: "opacity-100 scale-100"
      Leaving: "duration-100 ease-in"
        From: "opacity-100 scale-100"
        To: "opacity-0 scale-95"
    -->
    <div class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden" :class="showMenu ? 'block' : 'hidden'">
      <div class="rounded-lg shadow-md">
        <div
          class="rounded-lg bg-white shadow-xs overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="main-menu"
        >
          <div class="px-5 pt-4 flex items-center justify-between">
            <div>
              <img class="h-8 w-auto" src="@/assets/logo1.png" alt>
            </div>
            <div class="-mr-2">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                aria-label="Close menu"
                @click="showMenu = ! showMenu"
              >
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="space-y-1 px-2 pt-2 pb-3" />
          <div>
            <a
              href="#"
              class="block w-full px-5 py-3 text-center font-medium text-white bg-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900 transition duration-150 ease-in-out"
              role="menuitem"
              @click="logout"
            >Logout</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      showMenu: false,
      dropdownOpen: false
    };
  },
  computed: {
    ...mapState(['user'])
  },

  created () {
    if (!this.$store.state.loggedIn) {
      this.$router.replace('/onboarding');
    }
  },
  methods: {
    logout () {
      this.$store.commit('setLogout');
      this.$router.push('/onboarding');
    },

    toggleDropdown () {
      this.dropdownOpen = !this.dropdownOpen;
    }
  },
  head () {
    return {
      title: 'Per Diem | Store onboarding',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Merchant onboarding'
        }
      ]
    };
  }
};
</script>
