import axios from 'axios'

const api = axios.create({
  baseURL: "https://roo3n70fy8.execute-api.ap-southeast-1.amazonaws.com"
})

export default api
