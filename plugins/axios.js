import axios from 'axios';
const { API_URL } = require('../nuxt.config').publicRuntimeConfig;
export default axios.create({
  baseURL: API_URL
});
