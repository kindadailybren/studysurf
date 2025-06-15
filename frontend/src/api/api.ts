import axios from 'axios'

const api = axios.create({
  baseURL: "https://aw4edjvxsi54c4vuy7csna5a740iyaxz.lambda-url.ap-southeast-1.on.aws"
})

export default api
