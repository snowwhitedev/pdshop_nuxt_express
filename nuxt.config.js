module.exports = {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Per Diem | Build Subscription in 5 minutes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      {
        hid: 'Stripe',
        src: 'https://js.stripe.com/v3/',
        type: 'text/javascript',
        defer: true
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/tailwind.css', '@/assets/scss/main.scss'],
  generate: {
    fallback: true
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/analytics', mode: 'client' },
    {
      src: '~/plugins/vuex-persist',
      mode: 'client'
    }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome',
    '@nuxtjs/tailwindcss'
  ],
  fontawesome: {
    icons: {
      solid: [
        'faShoppingBag',
        'faCartPlus',
        'faMapMarkerAlt',
        'faMapMarkedAlt',
        'faSignOutAlt',
        'faSignInAlt',
        'faHome',
        'faBell',
        'faWarehouse',
        'faBox',
        'faTrash',
        'faEdit',
        'faArrowRight',
        'faArrowLeft',
        'faCog',
        'faEnvelope',
        'faCashRegister',
        'faMoneyCheckAlt',
        'faAward',
        'faChevronLeft',
        'faBars',
        'faTimes',
        'faCloudUploadAlt',
        'faTags',
        'faSyncAlt',
        'faEllipsisV'
      ]
    }
  },
  buefy: {
    materialDesignIcons: false,
    defaultIconPack: 'fas',
    defaultIconComponent: 'font-awesome-icon'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api'
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    }
  },
  serverMiddleware: ['~/api/index.js'],

  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    PERDIEM_DOMAIN: process.env.PERDIEM_DOMAIN,
    STRIPE_TEST_CONNECT_URL: 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_HOXidOExhLb1HZ68ippaXJkJlkpVhh2b&scope=read_write',
    STRIPE_LIVE_CONNECT_URL: 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_HOXih4fSZ3H9aPCJuISaOYj690IzQ7xE&scope=read_write',
    STRIPE_TEST_PUBLISHABLE_KEY: process.env.STRIPE_TEST_PUBLISHABLE_KEY || 'pk_test_MpCmliZ00L1DFE6kKfE0BkGO00mf51mS9c',
    STRIPE_LIVE_PUBLISHABLE_KEY: process.env.STRIPE_LIVE_PUBLISHABLE_KEY,
    CDN_URL: process.env.CDN_URL || 'https://cdn.per-diem.co'
  },
  privateRuntimeConfig: {
    PG_URL:
      process.env.PG_URL ||
      'postgres://postgres:pass123@localhost:5432/perdiem',
    USERS_TABLE: 'per_users',
    STORES_TABLE: 'per_stores',
    PRODUCTS_TABLE: 'per_products',
    ORDERS_TABLE: 'per_orders',
    PICKUPS_TABLE: 'per_pickups',
    SUBSCRIPTIONS_TABLE: 'per_subscriptions',
    ADDONS_TABLE: 'per_addons',
    COUPONS_TABLE: 'per_coupons',
    STORES_SHIPPING_TABLE: 'per_stores_shipping',
    USERS_TYPES: {
      ADMIN: 'admin',
      PUBLIC: 'public',
      MERCHANT: 'merchant'
    },
    JWT_SECRET: process.env.JWT_SECRET || 'shh...',
    JWT_AUTH_EXPIRED: process.env.JWT_AUTH_EXPIRED || '1d',
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    COOKIE_EXPIRATION: process.env.COOKIE_EXPIRATION, // 14 days
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'SG.nokey',
    STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
    STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
    IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    EMAIL_TEMPLATES: {
      WELCOME_SHOPPER: 'd-b8455c51d95f46f5a5ba674e1c27b5ea',
      WELCOME_MERCHANT: 'd-3d4720f008484f058c701c961540eb0d',
      RESET_PASSWORD: 'd-b2cf7c5e0dfc4635b3b9bc8cceced90a',
      NEW_SUBSCRIPTION_MERCHANT: 'd-6c4c8da8de644dbfa2e42d5b339803d5',
      RECEIP: 'd-b4ff20ea133f4cf99259d2d0f97c7e53'
    }
  }
};
