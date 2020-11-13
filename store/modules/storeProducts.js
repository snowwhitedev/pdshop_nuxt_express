import { FETCH_STORE_PRODUCTS, SET_STORE_PRODUCTS, GET_STORE_PRODUCTS } from "../types";

const state = () => ({
  storeProducts: []
});

const actions = {
  async [FETCH_STORE_PRODUCTS] ({ commit, rootState }, storeId) {
    const { data: { products } } = await this.$axios.get(
      `/onboarding/stores/${storeId}/products`,
      {
        headers: {
          'x-access-token': rootState.token
        }
      }
    );
    console.log("[rooddddt]", products);
    commit(SET_STORE_PRODUCTS, products);
  } 
};

const mutations = {
  [SET_STORE_PRODUCTS] (state, payload) {
    state.storeProducts = payload;
  }
};

const getters = {
  [GET_STORE_PRODUCTS]: state => state.storeProducts
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
