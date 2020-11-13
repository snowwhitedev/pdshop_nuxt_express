<template>
  <div class="relative h-full overflow-hidden bg-gray-100">
    <div class="relative pt-6 pb-12 sm:pb-32">
      <nav class="relative flex items-center justify-between max-w-screen-xl px-4 mx-auto sm:px-6">
        <div class="flex items-center flex-1">
          <div class="flex items-center justify-between w-full md:w-auto">
            <a href="#" aria-label="Home">
              <img class="w-auto h-8 sm:h-10" src="@/assets/logo1.png" alt="Logo">
            </a>
            <div class="flex items-center -mr-2 md:hidden">
              <button
                id="main-menu"
                type="button"
                class="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                aria-label="Main menu"
                aria-haspopup="true"
                @click="showMenu = !showMenu"
              >
                <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
        <div class="hidden md:flex">
          <a
            href="#"
            class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-red-700 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-gray focus:border-gray-700 active:bg-gray-600"
            @click="openModal"
          >Log in</a>
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
      <div class="absolute inset-x-0 top-0 p-2 transition origin-top-right transform md:hidden" :class="showMenu ? 'block' : 'hidden'">
        <div class="rounded-lg shadow-md">
          <div
            class="overflow-hidden bg-white rounded-lg shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="main-menu"
          >
            <div class="flex items-center justify-between px-5 pt-4">
              <div>
                <img class="w-auto h-8" src="@/assets/logo1.png" alt>
              </div>
              <div class="-mr-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                  aria-label="Close menu"
                  @click="showMenu = !showMenu"
                >
                  <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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
            <div class="px-2 pt-2 pb-3 space-y-1" />
            <div>
              <a
                href="#"
                class="block w-full px-5 py-3 font-medium text-center text-white transition duration-150 ease-in-out bg-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                role="menuitem"
                @click="openModal"
              >Log in</a>
            </div>
          </div>
        </div>
      </div>
      <main class="h-full mt-8 sm:mt-16 md:mt-20 lg:mt-24">
        <div class="max-w-screen-xl mx-auto">
          <div class="lg:grid lg:grid-cols-12 lg:gap-32">
            <div
              class="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center"
            >
              <div>
                <a
                  href="https://shop.per-diem.co/m/farmers-markets-and-csa-program/"
                  class="inline-flex items-center p-1 pr-2 text-white bg-gray-800 rounded-full sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                >
                  <span
                    class="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-red-700 rounded-full"
                  >We're live</span>
                  <span class="ml-4 text-sm leading-5">View a live demo</span>
                  <svg class="w-5 h-5 ml-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <h2
                  class="mt-4 text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:mt-5 sm:leading-none sm:text-6xl lg:mt-6 lg:text-5xl xl:text-6xl"
                >
                  Add secure subscriptions to
                  <br class="hidden md:inline">
                  <span class="text-red-700">your website in minutes.</span>
                </h2>
                <p
                  class="mt-3 text-base text-gray-800 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
                >
                  Earn predictable revenue by offering subscriptions at weekly, monthly, or yearly intervals. Reward loyalty and drive sales by offering promotions to new and returning customers.
                </p>
              </div>
            </div>
            <div class="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 lg:mr-24">
              <div
                class="bg-white shadow-xl sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden"
              >
                <div class="px-4 py-8 sm:px-10">
                  <p
                    class="flex flex-col items-center w-full text-xl font-bold text-gray-900"
                  >
                    Tell us about yourself
                  </p>
                  <div class="mt-6">
                    <form action="#" method="POST" class="space-y-6">
                      <div>
                        <label for="first-name" class="sr-only">First name</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="first-name"
                            v-model="registerForm.first_name"
                            placeholder="First name"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <label for="last-name" class="sr-only">Last name</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="last-name"
                            v-model="registerForm.last_name"
                            placeholder="Last name"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <label for="email" class="sr-only">Email</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="email"
                            v-model="registerForm.email"
                            placeholder="Email"
                            type="email"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <label for="phone" class="sr-only">Phone</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="phone"
                            v-model="registerForm.phone"
                            placeholder="Phone"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <label for="password" class="sr-only">Password</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="password"
                            v-model="registerForm.password"
                            type="password"
                            placeholder="Password"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <label for="re-password" class="sr-only">Confirm Password</label>
                        <div class="rounded-md shadow-sm">
                          <input
                            id="re-password"
                            v-model="confirm_password"
                            type="password"
                            placeholder="Retype Password"
                            required
                            class="block w-full px-3 py-2 placeholder-gray-500 transition duration-150 ease-in-out border border-gray-400 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                          >
                        </div>
                      </div>

                      <div>
                        <span class="block w-full rounded-md shadow-sm">
                          <button
                            :disabled="isLoading"
                            class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md disabled:opacity-50 hover:bg-red-600 focus:outline-none focus:border-gray-500 focus:shadow-outline-gray active:bg-red-800"
                            @click.prevent="register"
                          >
                            <span v-if="isLoading">Creating...</span>
                            <span v-else>Create your account</span></button>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="px-4 py-6 border-t-2 border-gray-200 bg-gray-50 sm:px-10">
                  <p class="text-xs leading-5 text-gray-500">
                    By signing up, you agree to our
                    <a
                      href="#"
                      class="font-medium text-gray-900 hover:underline"
                    >Terms</a>,
                    <a href="#" class="font-medium text-gray-900 hover:underline">Data Policy</a> and
                    <a href="#" class="font-medium text-gray-900 hover:underline">Cookies Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <Footer />

    <!-- Login modal starts here -->
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
                Sign in to your account
              </h2>
            </div>
            <form class="mt-8" action="#" method="POST">
              <input type="hidden" name="remember" value="true">
              <div class="rounded-md shadow-sm">
                <div>
                  <b-input
                    v-model="loginForm.email"
                    aria-label="Email address"
                    name="email"
                    type="email"
                    required
                    class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-600 bg-gray-200 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <b-input
                    v-model="loginForm.password"
                    aria-label="Password"
                    name="password"
                    type="password"
                    required
                    class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-600 bg-gray-300 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between mt-6">
                <div class="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    class="w-4 h-4 text-gray-700 transition duration-150 ease-in-out form-checkbox"
                  >
                  <label
                    for="remember_me"
                    class="block ml-2 text-sm leading-5 text-gray-900"
                  >Remember me</label>
                </div>

                <div class="text-sm leading-5">
                  <a
                    href="#"
                    class="font-medium text-red-700 transition duration-150 ease-in-out hover:text-red-500 focus:outline-none focus:underline"
                    @click="openPasswordResetModal"
                  >Forgot your password?</a>
                </div>
              </div>

              <div class="mt-6">
                <button
                  :disabled="isLoading"
                  class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                  @click.prevent="login"
                >
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="w-5 h-5 transition duration-150 ease-in-out"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <span v-if="isLoading">signing in...</span>
                  <span v-else>Sign in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Account activation modal starts here -->
    <b-modal
      :active.sync="makeActivateModal"
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
                Activate your account
              </h2>
            </div>
            <div class="mt-8">
              <div class>
                <input
                  id="last-name"
                  v-model="email"
                  placeholder="email"
                  class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                >
              </div>
              <div v-if="error" class="w-full p-2 m-2 bg-red-200 rounded">
                <span class="text-xs font-semibold text-red-700 font-ubuntu">{{ errorMessage }}</span>
              </div>
              <div class="mt-6">
                <button
                  class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                  @click.prevent="activate"
                >
                  <span v-if="isLoading">Activating...</span>
                  <span v-else>Activate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Send password reset request modal-->
    <b-modal
      :active.sync="makePasswordRequestModal"
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
                Send password reset request
              </h2>
            </div>
            <div class="mt-8">
              <div class>
                <b-tooltip label="Enter email to send reset link" type="is-info" position="is-bottom" class="w-full">
                  <input
                    id="email"
                    v-model="email"
                    placeholder="email"
                    class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </b-tooltip>
              </div>
              <div v-if="error" class="w-full p-2 m-2 bg-red-200 rounded">
                <span class="text-xs font-semibold text-red-700 font-ubuntu">{{ errorMessage }}</span>
              </div>
              <div class="mt-6">
                <button
                  class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                  @click.prevent="sendMail"
                >
                  <span v-if="isLoading">Sending...</span>
                  <span v-else>Send mail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Password reset modal starts here -->
    <b-modal
      :active.sync="makePasswordResetModal"
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
                Reset your password
              </h2>
            </div>
            <div class="mt-8">
              <div class>
                <b-tooltip label="Enter new password" type="is-info" position="is-bottom" class="w-full">
                  <input
                    id="password"
                    v-model="new_password"
                    type="password"
                    placeholder="New Password"
                    class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </b-tooltip>
              </div>
              <div class>
                <b-tooltip label="Confirm new password" type="is-info" position="is-bottom" class="w-full">
                  <input
                    id="confirm-password"
                    v-model="confirm_password"
                    type="password"
                    placeholder="confirm password"
                    class="block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-400 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                  >
                </b-tooltip>
              </div>
              <div v-if="error" class="w-full p-2 m-2 bg-red-200 rounded">
                <span class="text-xs font-semibold text-red-700 font-ubuntu">{{ errorMessage }}</span>
              </div>
              <div class="mt-6">
                <button
                  class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md group hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600"
                  @click.prevent="resetPassword"
                >
                  <span v-if="isLoading">Resetting...</span>
                  <span v-else>Reset password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Footer from '../../components/footer';

export default {
  layout: 'none',
  components: {
    Footer
  },
  data () {
    return {
      showMenu: false,
      showTooltip: false,
      makeModal: false,
      makeActivateModal: false,
      makePasswordResetModal: false,
      makePasswordRequestModal: false,
      loading: false,
      isLoading: false,
      error: false,
      errorMessage: '',
      registerForm: {
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: ''
      },
      new_password: '',
      confirm_password: '',
      email: '',
      loginForm: {
        email: '',
        password: ''
      }
    };
  },
  computed: {
    ...mapState(['loggedIn'])
  },
  created () {
    if (this.$route.query.activate) {
      this.makeActivateModal = true;
    }

    if (this.$route.query.resetPassword) {
      this.makePasswordResetModal = true;
    }

    if (this.loggedIn) {
      this.$router.push('/onboarding/dashboard');
    }
  },
  methods: {
    openModal () {
      this.makeModal = true;
    },

    openPasswordResetModal () {
      this.makeModal = false;
      this.makePasswordRequestModal = true;
    },

    async sendMail () {
      try {
        await this.$axios.post('/shop/users/auth/reset', { email: this.email });
        this.makePasswordRequestModal = false;
        this.email = '';
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message:
            'Email sent successfully, check your mail inbox for next step.',
          position: 'is-bottom-right',
          type: 'is-success'
        });
      } catch {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Email could not send, try again.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async resetPassword () {
      const token = this.$route.query.token;
      try {
        if (this.new_password !== this.confirm_password) {
          this.isLoading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Password do not match, login to continue.',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        }
        await this.$axios.post(`/shop/users/auth/reset/${token}`, {
          newPassword: this.new_password
        });
        this.makePasswordResetModal = false;
        this.makeModal = true;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Password reset successful, login to continue.',
          position: 'is-bottom-right',
          type: 'is-success'
        });
      } catch (error) {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Unable to reset password at this time, try again.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      } finally {
        this.new_password = '';
        this.confirm_password = '';
      }
    },

    async activate () {
      try {
        const res = await this.$axios.get('/onboarding/stores/verify', {
          headers: {
            'x-access-token': this.$route.query.token
          }
        });

        if (res.data.valid) {
          this.makeActivateModal = false;
          this.makeModal = true;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Activation successful, login to continue.',
            position: 'is-bottom-right',
            type: 'is-success'
          });
        }
      } catch {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Unable to activate account.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async register () {
      this.isLoading = true;
      if (this.confirm_password !== this.registerForm.password) {
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: "Passwords don't match",
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }

      if (this.registerForm.password.length < 8) {
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Passwords cannot be less than 8 characaters',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }

      await this.$axios
        .post('/onboarding/users/register', this.registerForm)
        .then((res) => {
          this.$store.commit('setUser', res.data.UserRecord);
          this.$store.commit('setToken', res.data.token);
          this.$store.commit('setStore', res.data.storeRecord);
          this.$store.commit('setAuth');
          this.isLoading = false;
          this.$router.push('/onboarding/register-business');
        })
        .catch((err) => {
          console.error(err);
          this.isLoading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message:
              "An error occurred or you're trying to register an existing user.",
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        });
    },

    async login () {
      this.isLoading = true;
      // authenticate user credentials
      await this.$axios
        .post('/onboarding/users/auth', this.loginForm)
        .then((res) => {
          this.$store.commit('setUser', res.data.UserRecord);
          this.$store.commit('setToken', res.data.token);
          this.$store.commit('setAuth');
          // get store by user
          if (res.data.store.active) {
            // redirect to dashboard
            this.$store.commit('setStore', res.data.store);
            this.isLoading = false;
            this.$router.push('/onboarding/dashboard');
          } else {
            // if no store is registered under the logged in user,
            // redirect to business registration page
            this.isLoading = false;
            this.$store.commit('setStore', res.data.store);
            this.$router.push('/onboarding/register-business');
          }
        })
        .catch(() => {
          this.isLoading = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Invalid credentials or unauthorized, try again',
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        })
        .finally(() => {
          // unset form fields
          this.loginForm.email = '';
          this.loginForm.password = '';
        });
    }
  }
};
</script>
