# Per-Diem

## Getting started
- Set node version `nvm use .` (node 12.18.1 LTS)
- Install packages `npm i`
- Start PG locally in a docker container `npm run docker:db`
- Run migrations `PG_URL=postgres://postgres:pass123@localhost:5432/perdiem npm run db:migrate`
- Run seed: `PG_URL=postgres://postgres:pass123@localhost:5432/perdiem npm run db:seed`


## URLS
- Store page: `[GET] /m/:slug` -> Load store page
- Get Store info: `[GET] /api/stores/slug/:slug` -> return store information (store_id, name, title, etc..)
- Post visitor email: `[POST] /api/shop/stores/:store_id/user` -> return a JWT token if new user.
- If user exist show password: `[POST] /api/shop/users/auth` { email, password } -> returns a JWT token
- Get List of products: `[GET] /api/stores/:store_id/products` -> Get list of products
- Select product `[POST] /api/shop/stores/:store_id/products` -> create a placeholder for order


## How to insert a new store:
### Store
```sql
INSERT INTO per_stores(email, slug, name, phone, website, logo, title, sub_title, active)
VALUES ('info@normansfarmmarket.com', 'normans-farm-market',
E'Norman\'s Farm Market', '3016749929', 'https://normansfarmmarket.com/',
'http://normansfarmmarket.com/wp-content/uploads/2017/03/NFM_translogo300.png',
E'Norman\'s Farm Market', E'You\'re onto something good', true);
```
** Save the store id we will need if for the next queries

### Products
```sql
INSERT INTO per_products(store_id, name, title, description, is_active, prices,  frequency)
VALUES (1, 'small', 'Small', '6-8 items', true, '[{"price_id":1,"interval":"monthly","price":49}, {"price_id":2,"interval":"yearly","price":490}]', 'month');
INSERT INTO per_products(store_id, name, title, description, is_active, prices,  frequency)
VALUES (1, 'large', 'Large', '10-12 items', true, '[{"price_id":1,"interval":"monthly","price":99}, {"price_id":2,"interval":"yearly","price":999}]', 'month');
INSERT INTO per_products(store_id, name, title, description, is_active, prices,  frequency)
VALUES (1, 'jumbo', 'Jumbo', '16-20 items', true, '[{"price_id":1,"interval":"monthly","price":149}, {"price_id":2,"interval":"yearly","price":1499}]', 'month');
```

### Pickups
```sql
INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 1', 'North Chevy Chase Elementary School', 'No winter season', 'sunday', '11 AM', '2 PM', '{"country":"US","state":"MD","city":"Chevy Chase","address":"3700 Jones Bridge Road","zip":"20817"}', true);

INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 2', 'Ohr Kodesh Congregation', 'No winter season', 'tuesday', '4:30 PM', '6:30 PM', '{"country":"US","state":"MD","city":"Chevy Chase","address":"8300 Meadowbrook Lane","zip":"20815"}', true);

INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 3', 'Timberlawn Local Park', 'No winter season', 'wednesday', '11 AM', '1 PM', '{"country":"US","state":"MD","city":"Rockville","address":"10800 Gloxinia Drive","zip":"20852"}', true);

INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 4', 'Geneva Presbyterian Church', 'No winter season', 'wednesday', '4:30  PM', '6:30 PM', '{"country":"US","state":"MD","city":"Potomac","address":"11931 Seven Locks Road","zip":"20854"}', true);

INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 5', 'Westland Middle School', 'School parking lot / No winter season', 'thursday', '4:30  PM', '6:30 PM', '{"country":"US","state":"MD","city":"Bethesda","address":"5511 Massachusetts Ave","zip":"20816"}', true);

INSERT INTO per_pickups (store_id, product_ids, name, title, description, day_of_week, start_time, end_time, location, is_active) VALUES (1, '{7,6,5}', 'Pickup 6', 'Kol Shalom', 'No winter season', 'friday', '11:00 AM', '1:00 PM', '{"country":"US","state":"MD","city":"Rockville","address":"9110 Darnestown Road","zip":"20850"}', true);
```