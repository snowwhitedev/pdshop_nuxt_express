# Per Diem - Shopping flow experience


## Subscription never been easier


### Configurations
- All configurations are set in Terraform config under `github.com/PerDiemInc/terraform-production`

### Database
- Make sure docker is installed.
- Create postgresql as a docker container `npm run docker:db`
- Run Migrations `npm run db:migrate`
- Seed the database `npm run db:seed`


### Code
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


## Dockerfile
- 