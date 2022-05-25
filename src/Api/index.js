import axios from 'axios'
import config from "../config";

const $api = axios.create({
  withCredentials: true,
  baseURL: config.BASE_URL,
})

export default $api
