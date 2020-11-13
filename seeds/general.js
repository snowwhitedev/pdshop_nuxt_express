const faker = require('faker');
const {
  USERS_TABLE,
  USERS_TYPES,
  STORES_TABLE,
  PRODUCTS_TABLE,
  ADDONS_TABLE,
  PICKUPS_TABLE,
  SUBSCRIPTIONS_TABLE,
  ORDERS_TABLE
} = require('../nuxt.config').privateRuntimeConfig;
const { address, name, internet, random, lorem } = faker;

const getUsers = () => {
  const tmpPassword = 'pass123';
  const { getPasswordHash } = require('../api/models/auth');
  const hashedPassword = getPasswordHash(tmpPassword);
  const fakeAddress = {
    country: 'USA',
    address: address.streetAddress(),
    city: address.city(),
    zip: address.zipCode(),
    state: address.stateAbbr()
  };
  return [
    {
      user_id: 1,
      user_type: USERS_TYPES.ADMIN,
      email: 'admin@per-diem.co',
      phone: '5551231234',
      first_name: name.firstName(),
      last_name: name.lastName(),
      billing_address: fakeAddress,
      shipping_address: fakeAddress,
      password: hashedPassword,
      active: true
    },
    {
      user_id: 2,
      user_type: USERS_TYPES.PUBLIC,
      email: 'public@per-diem.co',
      phone: '5551231234',
      first_name: name.firstName(),
      last_name: name.lastName(),
      billing_address: fakeAddress,
      shipping_address: fakeAddress,
      password: hashedPassword,
      active: true
    },
    {
      user_id: 3,
      user_type: USERS_TYPES.MERCHANT,
      email: 'merchant@per-diem.co',
      phone: '5551231234',
      first_name: name.firstName(),
      last_name: name.lastName(),
      billing_address: fakeAddress,
      shipping_address: fakeAddress,
      password: hashedPassword,
      active: true
    },
    {
      user_id: 4,
      user_type: USERS_TYPES.PUBLIC,
      email: 'public-notactive@per-diem.co',
      phone: '5551231234',
      first_name: name.firstName(),
      last_name: name.lastName(),
      billing_address: fakeAddress,
      shipping_address: fakeAddress,
      password: hashedPassword,
      active: false
    },
    {
      user_id: 5,
      user_type: USERS_TYPES.PUBLIC,
      email: 'franciscoh017@gmail.com',
      phone: '5551231234',
      first_name: 'Francisco',
      last_name: name.lastName(),
      billing_address: fakeAddress,
      shipping_address: fakeAddress,
      password: hashedPassword,
      active: true
    }
  ];
};

const getStores = () => {
  const NUMBER_OF_STORES = 10;
  const stores = [];

  for (let index = 0; index < NUMBER_OF_STORES; index++) {
    stores.push({
      store_id: index,
      stripe_user_id: 'acct_1H21lgHBgCNUeH4c',
      email: internet.email(),
      slug: lorem.slug(),
      name: `${faker.lorem.word()} ${faker.lorem.word()}`,
      sub_title: lorem.sentence(),
      phone: faker.phone.phoneNumber(),
      website: internet.url(),
      logo: faker.image.imageUrl(),
      primary_color: internet.color(),
      secondary_color: internet.color(),
      active: true,
      activated_at: faker.date.past()
    });
  }
  return stores;
};

// Get a list products
const getProducts = (stores) => {
  const storeIds = stores.map(x => x.store_id);

  const products = [];
  let productPK = 0;
  for (let index = 0; index < storeIds.length; index++) {
    for (let j = 0; j < 4; j++) {
      const prices = [
        {
          price_id: index * j + 32,
          price: random.number({ min: 29, max: 300 }),
          interval: 'month'
        },
        {
          price_id: index * j + 33,
          price: random.number({ min: 300, max: 6000 }),
          interval: 'year'
        }
      ];

      products.push({
        product_id: productPK,
        store_id: storeIds[productPK % storeIds.length],
        name: lorem.word(),
        title: lorem.sentence(),
        description: lorem.sentences(),
        is_active: random.boolean(),
        frequency: random.arrayElement(['week', 'month', 'year']),
        prices: JSON.stringify(prices)
      });

      productPK++;
    }
  }
  return products;
};

// Get list of addons
const getAddons = (stores, products) => {
  const storeIds = stores.map(x => x.store_id);
  const addons = [];

  const getListOfProductsByStoreId = (id) => {
    const min = random.number({ min: 0, max: 2 });
    const productIds = products
      .filter(x => x.store_id === id)
      .map(x => x.product_id);
    const max = random.number({ min, max: productIds.length });
    return productIds.slice(min, max);
  };

  // Create 100 random addons
  for (let index = 0; index < 100; index++) {
    const storeId = storeIds[index % storeIds.length];
    addons.push({
      store_id: storeId,
      product_ids: getListOfProductsByStoreId(storeId),
      name: lorem.word(),
      title: lorem.word(),
      description: lorem.sentences(),
      is_active: random.boolean(),
      price: random.number({ min: 29, max: 300 })
    });
  }
  return addons;
};

// Get list of pickups
const getPickups = (stores, products) => {
  const storeIds = stores.map(x => x.store_id);
  const pickups = [];

  const getListOfProductsByStoreId = (id) => {
    const min = random.number({ min: 0, max: 2 });
    const productIds = products
      .filter(x => x.store_id === id)
      .map(x => x.product_id);
    const max = random.number({ min, max: productIds.length });
    return productIds.slice(min, max);
  };
  // Create 100 random pickups
  for (let index = 0; index < 100; index++) {
    const storeId = storeIds[index % storeIds.length];
    pickups.push({
      pickup_id: index,
      store_id: storeId,
      product_ids: getListOfProductsByStoreId(storeId),
      name: lorem.word(),
      title: lorem.word(),
      description: lorem.sentences(),
      day_of_week: random.arrayElement([
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
      ]),
      start_time: random.number({
        min: 6,
        max: 12
      }),
      end_time: random.number({
        min: 12,
        max: 20
      }),

      location: {
        country: 'USA',
        address: address.streetAddress(),
        city: address.city(),
        zip: address.zipCode(),
        state: address.stateAbbr()
      },
      is_active: true
    });
  }
  return pickups;
};

const getSubscriptions = (stores, products, addons, users, pickups) => {
  const storeIds = stores.map(x => x.store_id);
  const subscriptions = [];

  // Get random user id
  const getUserId = () => {
    const userIds = users.map(x => x.user_id);
    return userIds[random.number({ min: 0, max: userIds.length })];
  };

  const getPickupId = (id) => {
    const pickupsIds = pickups
      .filter(x => x.store_id === id)
      .map(x => x.product_ids);

    let randomId = random.number({ min: 0, max: pickupsIds.length });
    while (pickupsIds[randomId] === undefined || Object.entries(pickupsIds[randomId]).length === 0) {
      randomId = random.number({ min: 0, max: pickupsIds.length });
    }

    return pickupsIds[randomId][0];
  };

  const getProductPriceByProductId = (product_id, store_id) => {
    const productPrices = products
      .find(x => x.product_id === product_id && x.store_id === store_id);

    if (!productPrices || !productPrices.prices) {
      throw new Error(`productPrices.prices is undefined ${productPrices}`);
    }

    const pricesArray = JSON.parse(productPrices.prices);
    let randomIndex = random.number({ min: 0, max: pricesArray.length - 1 });
    while (pricesArray[randomIndex] === undefined) {
      randomIndex = random.number({ min: 0, max: pricesArray.length - 1 });
    }
    return pricesArray[randomIndex].price_id;
  };

  // get list of addons
  const getAddons = (id) => {
    const min = random.number({ min: 0, max: 2 });
    const addonsIds = addons
      .filter(x => x.store_id === id)
      .map(x => x.addons_id);
    const max = random.number({ min, max: addonsIds.length });
    return addonsIds.slice(min, max);
  };

  // Create 100 random subscriptions
  for (let index = 0; index < 100; index++) {
    const storeId = storeIds[index % storeIds.length];
    const storeProducts = products.filter(product => product.store_id === storeId);
    const productId = storeProducts[index % storeProducts.length].product_id;
    subscriptions.push({
      subscription_id: index,
      store_id: storeId,
      product_id: productId,
      user_id: getUserId(),
      addons_ids: getAddons(storeId),
      pickup_id: getPickupId(storeId),
      frequency: random.arrayElement(['week', 'month', 'year']),
      stripe_price_id: getProductPriceByProductId(productId, storeId),
      is_active: random.boolean(),
      is_complete: random.boolean()
    });
  }
  return subscriptions;
};

const getOrders = (subscriptions) => {
  const orders = [];
  let counter = 0;
  subscriptions.forEach((sub) => {
    for (let index = 0; index < random.number({ min: 4, max: 20 }); index++) {
      const order = {
        order_id: counter,
        pickup_id: sub.pickup_id,
        subscription_id: sub.subscription_id,
        paid: random.boolean(),
        price: random.number({ min: 30, max: 5000 }),
        fulfillment_option: random.arrayElement(['pickup', 'shipping']),
        fulfilled: random.boolean()
      };
      counter++;
      orders.push(order);
    }
  });
  return orders;
};

exports.seed = function (knex) {
  // Get Data
  const usersTableData = getUsers();
  const storesTableData = getStores();
  const productsTableData = getProducts(storesTableData);
  const addonsTableData = getAddons(storesTableData, productsTableData);
  const pickupsTableData = getPickups(storesTableData, productsTableData);
  const subscriptionsTableData = getSubscriptions(
    storesTableData,
    productsTableData,
    addonsTableData,
    usersTableData,
    pickupsTableData
  );
  const ordersTableData = getOrders(subscriptionsTableData);

  return Promise.all([
    knex(USERS_TABLE).del(),
    knex(STORES_TABLE).del(),
    knex(PRODUCTS_TABLE).del(),
    knex(ADDONS_TABLE).del(),
    knex(PICKUPS_TABLE).del(),
    knex(SUBSCRIPTIONS_TABLE).del(),
    knex(ORDERS_TABLE).del()
  ])
    .then(() => {
      return Promise.all([
        knex(USERS_TABLE).insert(usersTableData),
        knex(STORES_TABLE).insert(storesTableData),
        knex(PRODUCTS_TABLE).insert(productsTableData),
        knex(ADDONS_TABLE).insert(addonsTableData),
        knex(PICKUPS_TABLE).insert(pickupsTableData),
        knex(SUBSCRIPTIONS_TABLE).insert(subscriptionsTableData),
        knex(ORDERS_TABLE).insert(ordersTableData)
      ]);
    })
    .then(() => {
      // Set auto inc' id to a 1000
      return Promise.all([
        knex.raw('ALTER SEQUENCE per_addons_addons_id_seq RESTART WITH 1000'),
        knex.raw('ALTER SEQUENCE per_orders_order_id_seq RESTART WITH 1000'),
        knex.raw('ALTER SEQUENCE per_pickups_pickup_id_seq RESTART WITH 1000'),
        knex.raw(
          'ALTER SEQUENCE per_products_product_id_seq RESTART WITH 1000'
        ),
        knex.raw('ALTER SEQUENCE per_stores_store_id_seq RESTART WITH 1000'),
        knex.raw(
          'ALTER SEQUENCE per_subscriptions_subscription_id_seq RESTART WITH 1000'
        ),
        knex.raw('ALTER SEQUENCE per_users_user_id_seq RESTART WITH 1000')
      ]);
    });
};
