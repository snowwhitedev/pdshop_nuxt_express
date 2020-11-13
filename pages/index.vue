<template>
  <div class="columns is-centered is-mobile has-text-centered">
    <div class="column is-half-desktop is-full-touch">
      <h1 class="title is-2 has-text-weight-bold">
        Getting your products has never been so easy!
      </h1>
      <section class="section">
        <h2 class="subtitle has-text-grey">
          Find your favorite provider and get started!
        </h2>
        <b-autocomplete
          v-model="name"
          :data="data"
          placeholder="e.g. Norman's Farm Market"
          field="title"
          @select="option => $router.push({ path: `m/${option.slug}` })"
        >
          <template slot-scope="props">
            <div class="media">
              <div class="media-left">
                <client-only>
                  <img width="32" :src="props.option.logo">
                </client-only>
              </div>
              <div>
                <p class="has-text-weight-bold is-capitalized">
                  {{ props.option.name }}
                </p>
                <small>
                  {{ overflowText(props.option.sub_title, 40) }}
                </small>
              </div>
            </div>
          </template>
        </b-autocomplete>
        <figure id="landing-image" class="image">
          <img src="@/assets/Delivery-bro.svg" alt="">
        </figure>
      </section>
    </div>
  </div>
</template>

<script>
import { overflowText } from '~/utils/index';
export default {
  name: 'Home',
  components: {},
  data () {
    return {
      data: [],
      selected: null,
      isFetching: false,
      name: '',
      page: 1,
      totalPages: 1,
      limit: 100,
      offset: 0
    };
  },
  mounted () {
    this.getStoresAsync();
  },
  methods: {
    overflowText,
    async getStoresAsync () {
      const params = [`limit=${this.limit}`, `offset=${this.offset}`].join('&');
      this.isFetching = true;
      try {
        const { stores } = await this.$axios.$get(
          `${this.$config.API_URL}/stores?${params}`
        );

        this.data = stores;
      } catch (e) {
        console.error(e.message);
      } finally {
        this.isFetching = false;
      }
    },
    getGeoData () {
      const context = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (a) {
          context.geolocation = a;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  #landing-image {
    img {
      max-width: 40rem;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
