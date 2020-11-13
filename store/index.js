import onboarding from './modules/onboarding';
import shopping from './modules/shopping';
import storeProducts from './modules/storeProducts';

export const state = () => ({
  user: {},
  store: {},
  products: {},
  pickups: {},
  coupons: {},
  addons: {},
  token: '',
  loggedIn: false
});

export const mutations = {
  setProducts (state, payload) {
    state.products = payload;
  },
  setPickups (state, payload) {
    state.pickups = payload;
  },
  setCoupons (state, coupons) {
    state.coupons = coupons;
  },
  setAddons (state, addons) {
    state.addons = addons;
  },
  setUser (state, user) {
    state.user = user;
  },
  setToken (state, token) {
    state.token = token;
  },
  setAuth (state) {
    state.loggedIn = true;
  },
  setStore (state, store) {
    state.store = store;
  },
  setLogout (state) {
    state.products = {};
    state.user = {};
    state.store = {};
    state.token = '';
    state.loggedIn = false;
    state.pickups = {};
    state.coupons = {};
    state.addons = {};
  }
};

export const actions = {
  setLogin ({ commit }) {
    commit('setAuth');
  },
  setLogout ({ commit }) {
    commit('setLogout');
  }
};

export const getters = {
  loggedIn: (state) => {
    return state.loggedIn;
  },
  getToken: (state) => {
    return state.token;
  },
  getUser: (state) => {
    return state.user;
  },
  getMerchant: (state) => {
    return state.merchant;
  },
  getProducts: (state) => {
    return state.products;
  }
};

export const modules = {
  onboarding,
  shopping,
  storeProducts
};
