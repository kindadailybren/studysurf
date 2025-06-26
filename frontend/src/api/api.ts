import axios from 'axios'

const api = axios.create({
  baseURL: "https://w87k0ope8a.execute-api.ap-southeast-1.amazonaws.com"
})

export default api
