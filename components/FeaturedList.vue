<template>
  <div>
    <div v-if="data.length > 0" class="columns is-multiline">
      <div v-for="(item, index) in data" :key="index" class="column is-full">
        <Featured
          v-if="selectedMode == 'shares'"
          :selected="item == selectedProduct"
        >
          <div class="columns is-mobile is-multiline">
            <div class="has-background-light box column is-full-mobile is-3-desktop">
              <div class="has-text-centered">
                <p
                  class="has-text-weight-bold is-size-6 is-capitalized"
                >
                  {{ item.title }}
                </p>
              </div>
            </div>

            <div class="column is-full-mobile">
              <p class="is-size-7">
                {{ item.description }}
              </p>
            </div>

            <div class="column">
              <div class="columns is-mobile">
                <div
                  v-for="price in item.prices"
                  :key="price.id"
                  class="column"
                >
                  <div
                    class="box"
                    :class="{
                      'selected': selectedProduct && selectedPrice ?
                        selectedProduct.product_id + selectedPrice.price_id == item.product_id + price.price_id : false
                    }"
                    @click="updateSelectedProduct(item, price)"
                  >
                    <div class="is-size-7">
                      <p class="is-capitalized has-text-grey">
                        {{ `${price.interval}` }}
                      </p>
                      <p class="has-text-weight-bold">
                        {{ `$${price.price}` }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Featured>

        <Featured
          v-else-if="selectedMode == 'pickups'"
          :selected="item == selectedPickup"
          class="pickup"
        >
          <div
            class="columns is-mobile"
            @click="updateSelectedPickup(item)"
          >
            <div class="has-background-light column box is-3">
              <div class="has-text-centered">
                <p
                  class="has-text-weight-bold is-capitalized is-size-5"
                >
                  {{ getDayOfTheWeekAbr(item.day_of_week) }}
                </p>
                <p class="is-size-7">
                  {{
                    `${item.start_time} - ${item.end_time}`
                  }}
                </p>
              </div>
            </div>
            <div class="column">
              <div>
                <p class="is-size-6 has-text-weight-bold is-capitalized">
                  {{ item.title }}
                </p>
                <div class="is-size-7 has-text-grey">
                  <b-icon
                    pack="fas"
                    icon="map-marker-alt"
                    size="is-small"
                  />
                  {{
                    `${item.location.address}, ${item.location.city}, ${item.location.state}, ${item.location.country}`
                  }}
                </div>
              </div>
            </div>
          </div>
        </Featured>

        <Featured
          v-else-if="selectedMode == 'addons'"
          :selected="selectedAddons.includes(item)"
        >
          <b-checkbox
            v-model="currentAddons"
            :native-value="item"
            size="is-small"
            type="is-dark"
            @input="updateselectedAddons(item.addons_id)"
          >
            <div class="columns is-centered is-mobile">
              <p
                class="has-text-centered has-text-weight-semibold is-size-7 column is-narrow"
              >
                {{ item.title }}
              </p>
            </div>

            <div class="columns is-mobile">
              <div class="column">
                <p class="is-size-7 has-text-weight-bold is-uppercase">
                  {{ item.description }}
                </p>
                <p class="is-size-7">
                  {{ item.price ? `$${item.price}` : "Price not set" }}
                </p>
              </div>
            </div>
          </b-checkbox>
        </Featured>
      </div>
    </div>
    <b-message v-else size="is-small" type="is-info" class="column">
      {{
        `There are no ${selectedMode} for the desired ${
          selectedMode == "shares" ? "store" : "product"
        }.`
      }}
    </b-message>
  </div>
</template>

<script>
import Featured from './Featured';
export default {
  name: 'FeaturedList',
  components: {
    Featured
  },
  props: {
    // Array of cards that must be showed on screen
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // REQUIRED: Template to display depending on the entity loaded on data prop
    // Modes: share, pickups, addons
    selectedMode: {
      type: String,
      required: true
    },
    //
    selectedProduct: {
      type: Object,
      default: null
    },
    selectedPrice: {
      type: Object,
      default: null
    },
    selectedPickup: {
      type: Object,
      default: null
    },
    selectedAddons: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data () {
    return {
      currentPrice: null,
      currentPickup: null,
      currentAddons: null
    };
  },
  mounted () {
    this.currentPrice = this.selectedPrice;
    this.currentPickup = this.selectedPickup;
    this.currentAddons = this.selectedAddons;
  },
  methods: {
    updateSelectedProduct (selectedProduct, price) {
      this.currentPrice = price;
      this.$emit('selected', {
        product: selectedProduct,
        price: this.currentPrice,
        pickup: this.currentPickup
      });
    },
    updateSelectedPickup (item) {
      this.currentPickup = item;
      this.$emit('selected', { pickup: this.currentPickup });
    },
    updateselectedAddons (addonsId) {
      this.$emit('selected', { addon: this.currentAddons, addonsId });
    },
    convertToTime (hours) {
      const time = new Date(null);
      return new Date(time.setHours(hours)).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getDayOfTheWeekAbr (dayOfTheWeek) {
      return dayOfTheWeek.substring(0, 3);
    }
  }
};
</script>

<style lang="scss" scoped>
  .pickup {
    cursor: pointer;
  }

  section {
    .columns {
      .column {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        .box {
          margin-bottom: 0 !important;

          .column.box {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F3F6FB !important;
            color: #576070 !important;
          }
          &.is-selected {
            .column.box {
              background-color: black !important;
              color: white !important;
            }
          }
          .columns {
            .column {
              .title {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              &:last-child {
                padding-top: 0;
                padding-bottom: 0;
              }
              .columns {
                height: 100%;
                margin-top: 0;
                margin-bottom: 0;
                .column {
                  padding: 0 0.25rem;
                  .box {
                    height: 100%;
                    padding: 0.75rem;
                    cursor: pointer;
                    display: flex;
                    border: solid #D1DBEC 1px;
                    align-items: center;
                    justify-content: center;

                    &.selected {
                      border-color:black;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
