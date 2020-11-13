const state = () => ({
  merchant: {},
  subscription: {},
  steps: [],
  isLoggingIn: false,
  loggedIn: false
});

const mutations = {
  setSubscription (state, subscription) {
    state.subscription = subscription;
  },
  setLoggingIn (state, value) {
    state.isLoggingIn = value;
  },
  setLoggedIn (state, value) {
    state.loggedIn = value;
  },
  setMerchant (state, response) {
    const { store } = response;
    state.merchant = store;
    state.steps = store.steps;
  },
  logout (state) {
    state.subscription = {};
    state.merchant = {};
    state.loggedIn = false;
  }
};

const actions = {
  async getMerchantProducts (state, merchantId) {
    const { data } = await this.$axios.$get(
      `/api/merchants/${merchantId}/products`
    );
    state.commit('setProducts', data);
  },
  async getMerchantBySlug (state, slug) {
    const response = await this.$axios.$get(
      `${this.$config.API_URL}/stores/slug/${slug}`
    );
    state.commit('setMerchant', response);
  },
  setLogin ({ commit }, value) {
    commit('setLoggedIn', value);
  },
  setUser ({ commit, user }) {
    commit('setUser', user);
  },
  setLogout ({ commit }) {
    commit('logout');
  },
  async checkUser ({ commit }, userInfo) {
    commit('setLoggingIn', true);
    let response = null;
    try {
      response = await this.$axios.$post(
        `${this.$config.API_URL}/shop/users/${this.state.shopping.merchant.store_id}/register`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          email: userInfo.email
        },
        {
          responseType: 'json'
        }
      );
    } catch (e) {
      console.error(e.message);
    } finally {
      commit('setLoggingIn', false);
    }
    return response;
  },
  async login ({ commit }, userInfo) {
    commit('setLoggingIn', true);
    let response = null;
    try {
      response = await this.$axios.$post(
        `${this.$config.API_URL}/shop/users/auth`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          email: userInfo.email,
          password: userInfo.password
        },
        {
          responseType: 'json'
        }
      );
    } catch (e) {
      console.error(e);
      return e;
    } finally {
      commit('setLoggingIn', false);
    }
    return response;
  }
};

const getters = {
  getStepTitle: state => (type) => {
    let title = '';
    state.steps
      .filter(x => x.type === type)
      .map((x) => {
        if (x.type === type) {
          title = x.title;
        }
      });

    return title;
  },
  getStepSubtitle: state => (type) => {
    let subtitle = '';
    state.steps
      .filter(x => x.type === type)
      .map((x) => {
        if (x.type === type) {
          subtitle = x.sub_title;
        }
      });

    return subtitle;
  },
  getStepIcon: state => (type) => {
    let icon = '';
    state.steps
      .filter(x => x.type === type)
      .map((x) => {
        if (x.type === type) {
          icon = x.icon;
        }
      });

    return icon;
  },
  getStepIconTitle: state => (type) => {
    let iconTitle = '';
    state.steps
      .filter(x => x.type === type)
      .map((x) => {
        if (x.type === type) {
          iconTitle = x.icon_title;
        }
      });

    return iconTitle;
  },
  getStepStatus: state => (type) => {
    let active = null;

    state.steps
      .filter(x => x.type === type)
      .map((x) => {
        if (x.type === type) {
          active = x.active;
        }
      });

    return active;
  },
  getRoutesDictionary: state => () => {
    const routes = [
      {
        stepIndex: 0,
        path: '/',
        active: true
      }
    ];
    let index = 0;
    state.steps.forEach((step) => {
      if (step.active) {
        routes.push({
          stepIndex: (index += 1),
          path: step.type == 'products' ? '/share' : step.type == 'pickup' ? '/pickups' : `/${step.type}`,
          active: step.active
        });
      }
    });

    return routes;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
